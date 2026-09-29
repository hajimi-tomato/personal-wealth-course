"""Attach the shared reference-link behavior to the 20 published chapter copies."""

from pathlib import Path


CHAPTERS = Path(__file__).resolve().parents[1] / "chapters"
TAG = '<script src="../citation-links.js?v=references-20260929" defer></script>'


def main() -> None:
    files = sorted(CHAPTERS.glob("wealth_chapter*.html"))
    if len(files) != 20:
        raise RuntimeError(f"Expected 20 chapters, found {len(files)}")
    for path in files:
        content = path.read_text(encoding="utf-8")
        if TAG in content:
            continue
        if "</body>" not in content:
            raise RuntimeError(f"Missing closing body tag: {path.name}")
        path.write_text(content.replace("</body>", f"{TAG}\n</body>", 1), encoding="utf-8")
    print(f"Attached citation links to {len(files)} chapters")


if __name__ == "__main__":
    main()
