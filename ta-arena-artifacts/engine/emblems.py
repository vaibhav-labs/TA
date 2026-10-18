"""World emblems (ported from src/ui/WorldIcon.tsx) and line icons as CSS masks. Presentation only."""
import urllib.parse

def _svg(inner, defs=""):
    return f'<svg class="emb" viewBox="0 0 36 36" aria-hidden="true" focusable="false">{defs}{inner}</svg>'

def _g(i, x1, y1, x2, y2, stops):
    s = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<linearGradient id="{i}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">{s}</linearGradient>'

EMBLEMS = {
 1: _svg('<g stroke="url(#w1g)" stroke-width="3" stroke-linecap="round"><line x1="8" y1="8" x2="8" y2="28"/><line x1="14" y1="8" x2="14" y2="28"/><line x1="20" y1="8" x2="20" y2="28"/><line x1="26" y1="8" x2="26" y2="28"/></g><line x1="4" y1="24" x2="30" y2="12" stroke="#FFFC00" stroke-width="2.5" stroke-linecap="round"/><circle cx="31" cy="11" r="2.5" fill="#FFFC00"/>',
         _g("w1g", "0%", "0%", "100%", "100%", [("0%", "#FFA000"), ("100%", "#FF3D00")])),
 2: _svg('<line x1="18" y1="6" x2="18" y2="30" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-dasharray="2 2"/><circle cx="18" cy="8" r="4.5" fill="#F43F5E" stroke="#fff" stroke-width="1.5"/><circle cx="18" cy="18" r="6" fill="#06B6D4" stroke="#FFFC00" stroke-width="2"/><circle cx="18" cy="28" r="4.5" fill="#F59E0B" stroke="#fff" stroke-width="1.5"/>'),
 3: _svg('<line x1="6" y1="6" x2="30" y2="30" stroke="url(#w3a)" stroke-width="3.2" stroke-linecap="round"/><line x1="30" y1="6" x2="6" y2="30" stroke="url(#w3b)" stroke-width="3.2" stroke-linecap="round"/><polygon points="30,30 24,29 29,24" fill="#C084FC"/><polygon points="6,30 12,29 7,24" fill="#FFFC00"/><circle cx="18" cy="18" r="3" fill="#fff"/><circle cx="18" cy="18" r="6" fill="none" stroke="#FFFC00" stroke-width="1.2" opacity="0.8"/>',
         _g("w3a", "0%", "0%", "100%", "100%", [("0%", "#C084FC"), ("100%", "#9333EA")]) + _g("w3b", "100%", "0%", "0%", "100%", [("0%", "#FFFC00"), ("100%", "#F59E0B")])),
 4: _svg('<path d="M18 9 C13 7 7 7 4 8 L4 26 C8 25 13 25 18 28 C23 25 28 25 32 26 L32 8 C29 7 23 7 18 9 Z" fill="url(#w4g)" stroke="#fff" stroke-width="1.5"/><line x1="18" y1="9" x2="18" y2="28" stroke="#FFE4E6" stroke-width="2"/><polygon points="18,14 14,21 22,21" fill="#FFFC00" stroke="#000" stroke-width="1"/>',
         _g("w4g", "0%", "0%", "100%", "100%", [("0%", "#FB7185"), ("100%", "#E11D48")])),
 5: _svg('<line x1="3" y1="13" x2="33" y2="13" stroke="#22D3EE" stroke-width="2" stroke-dasharray="3 1"/><polygon points="18,6 23,13 13,13" fill="#fff" stroke="#67E8F9" stroke-width="1.2"/><polygon points="13,13 23,13 27,29 9,29" fill="url(#w5g)" stroke="#0891B2" stroke-width="1.5"/><path d="M12 32 Q18 35 24 32" stroke="#06B6D4" stroke-width="1.5" fill="none" opacity="0.6" stroke-linecap="round"/>',
         _g("w5g", "0%", "0%", "0%", "100%", [("0%", "#FFFFFF"), ("40%", "#67E8F9"), ("100%", "#0E7490")])),
 6: _svg('<circle cx="18" cy="6" r="3.5" fill="#FFFC00" stroke="#fff" stroke-width="1"/><path d="M18 9.5 V16 M18 16 L9 26 M18 16 L27 26" stroke="#34D399" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="9" cy="27" r="4" fill="url(#w6g)" stroke="#fff" stroke-width="1.2"/><circle cx="27" cy="27" r="4" fill="url(#w6g)" stroke="#fff" stroke-width="1.2"/><line x1="12.5" y1="24" x2="23.5" y2="24" stroke="#FFFC00" stroke-width="1.5" stroke-dasharray="2 2"/>',
         _g("w6g", "0%", "0%", "100%", "100%", [("0%", "#34D399"), ("100%", "#059669")])),
 7: _svg('<path d="M7 23 A11 11 0 0 1 29 23 Z" fill="url(#w7g)" stroke="#FFFC00" stroke-width="1.5"/><line x1="3" y1="23" x2="33" y2="23" stroke="#FDE68A" stroke-width="2.5" stroke-linecap="round"/><g stroke="#FFFC00" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="5" x2="18" y2="9"/><line x1="8" y1="9" x2="11" y2="12"/><line x1="28" y1="9" x2="25" y2="12"/><line x1="31" y1="17" x2="27" y2="18"/><line x1="5" y1="17" x2="9" y2="18"/></g>',
         '<radialGradient id="w7g" cx="50%" cy="100%" r="80%"><stop offset="0%" stop-color="#FFFC00"/><stop offset="60%" stop-color="#F59E0B"/><stop offset="100%" stop-color="#D97706"/></radialGradient>'),
}

ICONS = {
 "check": '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
 "cross": '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
 "bolt": '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
 "eye": '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 "play": '<path d="M7 4v16l13-8z"/>',
 "search": '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
 "trophy": '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a3 3 0 0 0 4 3M16 6h4v1a3 3 0 0 1-4 3M12 13v4M8 21h8M10 17h4"/>',
 "pencil": '<path d="M4 20l1-4L16 5l3 3L8 19z"/>',
 "book": '<path d="M4 5a2 2 0 0 1 2-2h13v14H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 0 2 2h13v-4"/>',
 "help": '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>',
 "crown": '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
 "lock": '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 "home": '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
 "speaker": '<path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6"/>',
 "spark": '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
 "flag": '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
}

def _uri(inner):
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" '
           f'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{inner}</svg>')
    return "url(\"data:image/svg+xml," + urllib.parse.quote(svg, safe="/:=,() ") + "\")"

def icon_vars_css():
    return "  :root {\n" + "".join(f"    --i-{k}: {_uri(v)};\n" for k, v in ICONS.items()) + "  }\n"
