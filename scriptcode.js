// ==UserScript==
// @name         qBittorrent WebUI: Selected Count and Total Size
// @namespace    http://tampermonkey.net
// @version      1.0
// @description  This script calculates the count and total size of selected torrent files for QBT WebUI 5.2.0
// @match        *://localhost:8080/*
// @author       Taratayko t.me/thetrtk https://github.com/Taratayko
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        bottom: 15px;
        right: 20px;
        background: rgba(0,0,0,0.85);
        color: #fff;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 999999;
        pointer-events: none;
        white-space: pre-line;
        font-family: sans-serif;
    `;
    panel.textContent = "0⌤ | 0 B\nt.me/thetrtk";
    document.body.appendChild(panel);

    function parseSize(str) {
        const units = {
            B: 1, KB: 1024, MB: 1024**2, GB: 1024**3, TB: 1024**4,
            Б: 1, КБ: 1024, МБ: 1024**2, ГБ: 1024**3, ТБ: 1024**4,
            MIB: 1024**2, GIB: 1024**3, TIB: 1024**4
        };

        const match = str.trim().match(/([\d.,]+)\s*(Б|КБ|МБ|ГБ|ТБ|B|KB|MB|GB|TB|MiB|GiB|TiB)/i);
        if (!match) return 0;

        const value = parseFloat(match[1].replace(",", "."));
        const unit = match[2].toUpperCase();

        return value * (units[unit] || 1);
    }

    function formatSize(bytes) {
        const units = ["B","KB","MB","GB","TB"];
        let i = 0;
        while (bytes >= 1024 && i < units.length - 1) {
            bytes /= 1024;
            i++;
        }
        return bytes.toFixed(2) + " " + units[i];
    }

    function updateTotal() {
        // ВАЖНО: поддержка RU и EN выделения
        const rows = document.querySelectorAll('tr.selected, tr[aria-selected="true"]');

        const count = rows.length;
        let total = 0;

        rows.forEach(row => {
            const sizeCell = row.querySelector("td:nth-child(4)");
            if (sizeCell) total += parseSize(sizeCell.textContent);
        });

        panel.textContent = `${count}⌤ | ${formatSize(total)}\nt.me/thetrtk`;
    }

    setInterval(updateTotal, 300);
})();