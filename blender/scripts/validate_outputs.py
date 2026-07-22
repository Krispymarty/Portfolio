from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
CONFIG = json.loads((ROOT / "blender/config.json").read_text(encoding="utf-8"))
REPORT = ROOT / "blender/reports/validation-report.json"


def probe_video(path: Path) -> dict:
    command = [
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=width,height,nb_frames,r_frame_rate",
        "-of", "json", str(path),
    ]
    result = subprocess.run(command, capture_output=True, text=True, check=True)
    streams = json.loads(result.stdout).get("streams", [])
    return streams[0] if streams else {}


def main() -> None:
    failures: list[str] = []
    sequence_results = []
    total_size = 0
    expected_size = tuple(CONFIG["resolution"])

    for name, sequence in CONFIG["sequences"].items():
        directory = ROOT / sequence["directory"]
        expected_count = sequence["end"] - sequence["start"] + 1
        files = sorted(directory.glob("frame_*.webp"))
        missing = []
        if len(files) != expected_count:
            failures.append(f"{name} has {len(files)} numbered frames; expected {expected_count}")
        for frame in range(1, expected_count + 1):
            path = directory / f"frame_{frame:04d}.webp"
            if not path.exists():
                missing.append(frame)
                continue
            if path.stat().st_size == 0:
                failures.append(f"{path.relative_to(ROOT)} is empty")
                continue
            total_size += path.stat().st_size
            with Image.open(path) as image:
                if image.size != expected_size:
                    failures.append(f"{path.relative_to(ROOT)} has dimensions {image.size}")
        if missing:
            failures.append(f"{name} is missing frames: {missing}")

        poster = ROOT / f"public/cinematic/posters/{name}.webp"
        if not poster.exists() or poster.stat().st_size == 0:
            failures.append(f"Missing poster: {poster.relative_to(ROOT)}")
        else:
            with Image.open(poster) as image:
                if image.size != expected_size:
                    failures.append(f"{poster.relative_to(ROOT)} has dimensions {image.size}")

        video = ROOT / f"public/cinematic/mobile/{name}.mp4"
        video_probe = {}
        if not video.exists() or video.stat().st_size == 0:
            failures.append(f"Missing fallback video: {video.relative_to(ROOT)}")
        else:
            try:
                video_probe = probe_video(video)
                if (video_probe.get("width"), video_probe.get("height")) != expected_size:
                    failures.append(f"{video.relative_to(ROOT)} has dimensions {(video_probe.get('width'), video_probe.get('height'))}")
                if video_probe.get("r_frame_rate") != f"{CONFIG['frameRate']}/1":
                    failures.append(f"{video.relative_to(ROOT)} has frame rate {video_probe.get('r_frame_rate')}")
                if int(video_probe.get("nb_frames") or 0) != expected_count:
                    failures.append(f"{video.relative_to(ROOT)} has {video_probe.get('nb_frames')} frames; expected {expected_count}")
            except (subprocess.CalledProcessError, json.JSONDecodeError, ValueError) as error:
                failures.append(f"Could not validate {video.relative_to(ROOT)}: {error}")

        sequence_results.append({
            "name": name,
            "expected": expected_count,
            "actual": len(files),
            "missing": missing,
            "video": video_probe,
        })

    required = [
        ROOT / "public/cinematic/posters/workspace-anchor.webp",
        ROOT / "public/models/developer-workspace.glb",
    ]
    for path in required:
        if not path.exists() or path.stat().st_size == 0:
            failures.append(f"Missing required output: {path.relative_to(ROOT)}")
    anchor = required[0]
    if anchor.exists() and anchor.stat().st_size:
        with Image.open(anchor) as image:
            if image.size != expected_size:
                failures.append(f"{anchor.relative_to(ROOT)} has dimensions {image.size}")

    if total_size > 40 * 1024 * 1024:
        failures.append(f"Frame payload is {total_size / 1024 / 1024:.2f} MB, above the 40 MB budget")

    result = {
        "valid": not failures,
        "resolution": CONFIG["resolution"],
        "totalFrameBytes": total_size,
        "totalFrameMegabytes": round(total_size / 1024 / 1024, 2),
        "sequences": sequence_results,
        "failures": failures,
    }
    REPORT.write_text(json.dumps(result, indent=2), encoding="utf-8")
    if failures:
        raise SystemExit("\n".join(failures))
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()