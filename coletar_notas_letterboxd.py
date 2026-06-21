#!/usr/bin/env python3
"""
Coletor de notas do Letterboxd para o Cine Trunfo — versao 2 (varias listas).

O que muda da v1: agora ele varre VARIAS listas, junta tudo e remove os
filmes repetidos (que aparecem em mais de uma lista), gerando um unico CSV.

Pra adicionar mais filmes no futuro, e so acrescentar a URL da lista na
variavel LISTAS abaixo e rodar de novo.

Como rodar (no Terminal, dentro da pasta cine-trunfo):
  pip3 install requests beautifulsoup4   (ja instalado da outra vez, pode pular)
  python3 coletar_notas_letterboxd.py
"""

import csv
import re
import time
import requests
from bs4 import BeautifulSoup

# ----- CONFIGURACAO -----
# As listas que entram no baralho. Adicione/remova URLs a vontade.
LISTAS = [
    "https://letterboxd.com/skyalex/list/top-100-most-popular-movies-on-letterboxd/",
    "https://letterboxd.com/official/list/top-100-below-average-films-with-the-most/",
]
ARQUIVO_SAIDA = "notas_letterboxd.csv"
PAUSA_SEGUNDOS = 1.0
HEADERS = {"User-Agent": "Mozilla/5.0 (DDL Cine Trunfo - coleta pessoal)"}
# ------------------------

BASE = "https://letterboxd.com"


def slugs_da_lista(url):
    """Devolve os slugs dos filmes de uma lista, na ordem, percorrendo todas as paginas."""
    slugs = []
    pagina = 1
    while True:
        page_url = url if pagina == 1 else f"{url.rstrip('/')}/page/{pagina}/"
        r = requests.get(page_url, headers=HEADERS, timeout=20)
        if r.status_code != 200:
            break
        soup = BeautifulSoup(r.text, "html.parser")
        achados = []
        for p in soup.select("[data-film-slug], [data-target-link]"):
            slug = p.get("data-film-slug")
            if not slug:
                m = re.search(r"/film/([^/]+)/", p.get("data-target-link", ""))
                slug = m.group(1) if m else None
            if slug:
                achados.append(slug)
        novos = [s for s in achados if s not in slugs]
        if not novos:          # pagina vazia ou repetida = fim da lista
            break
        slugs.extend(novos)
        pagina += 1
    return slugs


def nota_do_filme(slug):
    """Abre a pagina do filme e devolve (titulo, nota_float ou None)."""
    r = requests.get(f"{BASE}/film/{slug}/", headers=HEADERS, timeout=20)
    soup = BeautifulSoup(r.text, "html.parser")

    tag_titulo = soup.find("meta", {"name": "twitter:title"}) or soup.find("meta", {"property": "og:title"})
    titulo = tag_titulo["content"] if tag_titulo and tag_titulo.get("content") else slug

    nota = None
    tag_nota = soup.find("meta", {"name": "twitter:data2"})
    if tag_nota and tag_nota.get("content"):
        m = re.search(r"([\d.]+)\s*out of 5", tag_nota["content"])
        if m:
            nota = float(m.group(1))
    return titulo, nota


def main():
    # 1) junta os slugs de todas as listas, sem repetir
    todos = []
    for url in LISTAS:
        print(f"Lendo lista: {url}")
        for s in slugs_da_lista(url):
            if s not in todos:
                todos.append(s)
    print(f"\n{len(todos)} filmes unicos no total. Coletando notas...\n")

    # 2) pega titulo + nota de cada filme
    linhas = []
    for i, slug in enumerate(todos, start=1):
        try:
            titulo, nota = nota_do_filme(slug)
        except Exception as e:
            titulo, nota = slug, None
            print(f"  ! erro em {slug}: {e}")
        print(f"{i:>3}. {titulo:<45} {nota if nota is not None else '-'}")
        linhas.append([i, titulo, slug, nota if nota is not None else ""])
        time.sleep(PAUSA_SEGUNDOS)

    # 3) salva o CSV combinado
    with open(ARQUIVO_SAIDA, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["rank", "titulo", "slug", "nota_letterboxd"])
        w.writerows(linhas)
    print(f"\nPronto! {len(linhas)} filmes salvos em {ARQUIVO_SAIDA}")


if __name__ == "__main__":
    main()
