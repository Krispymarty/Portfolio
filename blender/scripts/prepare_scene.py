import sys
import traceback
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

log = Path(__file__).resolve().parents[1] / 'logs' / 'prepare-scene.log'
try:
    from pipeline import create_scene
    create_scene()
    log.write_text('Scene preparation completed.\n', encoding='utf-8')
except Exception:
    log.write_text(traceback.format_exc(), encoding='utf-8')
    raise
