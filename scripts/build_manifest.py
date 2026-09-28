"""Build the reader navigation from the original chapter headings."""

from html.parser import HTMLParser
from pathlib import Path
import json
import re


ROOT = Path(__file__).resolve().parents[1]
CHAPTERS = ROOT / "chapters"


class ChapterParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.section_ids = []
        self.heading = None
        self.buffer = []
        self.title = ""
        self.subtitle = ""
        self.sections = []
        self.in_subtitle = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "section":
            self.section_ids.append(attrs.get("id", ""))
        if tag in {"h1", "h2"}:
            self.heading = tag
            self.buffer = []
        if "subtitle" in attrs.get("class", "").split():
            self.in_subtitle += 1
            self.buffer = []

    def handle_data(self, data):
        if self.heading:
            self.buffer.append(data)
        elif self.in_subtitle:
            self.buffer.append(data)

    def handle_endtag(self, tag):
        if tag == self.heading:
            value = "".join(self.buffer).strip()
            if tag == "h1":
                self.title = value
            else:
                self.sections.append({
                    "title": value,
                    "id": self.section_ids[-1] if self.section_ids else "",
                })
            self.heading = None
            self.buffer = []
        if tag == "div" and self.in_subtitle:
            self.subtitle = "".join(self.buffer).strip()
            self.in_subtitle = 0
            self.buffer = []
        if tag == "section" and self.section_ids:
            self.section_ids.pop()


def main():
    entries = []
    for path in sorted(CHAPTERS.glob("wealth_chapter*.html"), key=lambda p: int(re.search(r"chapter(\d+)", p.name).group(1))):
        number = int(re.search(r"chapter(\d+)", path.name).group(1))
        parser = ChapterParser()
        parser.feed(path.read_text(encoding="utf-8"))
        entries.append({
            "number": number,
            "title": parser.title,
            "subtitle": parser.subtitle,
            "file": f"chapters/{path.name}",
            "sections": parser.sections,
        })

    assert [item["number"] for item in entries] == list(range(1, 21))
    assert all(item["title"] and item["sections"] for item in entries)
    data = "window.COURSE_CHAPTERS = " + json.dumps(entries, ensure_ascii=False, indent=2) + ";\n"
    (ROOT / "course-data.js").write_text(data, encoding="utf-8")
    print(f"Wrote {len(entries)} chapters and {sum(len(item['sections']) for item in entries)} sections")


if __name__ == "__main__":
    main()
