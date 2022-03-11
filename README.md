# NodeJS Framework V2

Willkommen zu meinem NodeJS Framework.

Aktuell werden folgende Features unterstützt:

- Modularer Aufbau
- Express Webserver
- Automatische Datenbankanlage (TypeORM)
- Login für Backend und Frontend
- Rollenverteilung auf Accounts
- Rechteverwaltung auf Rollen
- Frontend - Twig Templates
- Frontend - Automatische DataTable anhand DB Tabelle

###Aufbau - Ordnerstruktur:
Das Framework ist im "resources" Ordner standardmäßig in 4 Unterordner verteilt.

Ordner | Beschreibung
--- |--------------
backend | Programmierung
frontend | Twig Templates & Frontend Scripts / Styles
config | Konfigurationsdateien
logFiles | Serverlogs

###Aufbau - Sytem
[coming soon]

###Plugins:
Es ist möglich eigene Plugins / Module für dieses Framework zu erstellen.

Dabei ist zu beachten, dass alle Systemrelevaten Module mit einem Unterstrich vor dem Modulverzeichnis versehen sind.
Wenn Sie also updatefähig bleiben wollen, sollten die Originaldateien nicht verändert werden. 

###Modulerstellung:

Eigene Module können Sie über die "index_custom.js" Datei im Root Verzeichnis importieren.

Beispiel:
> import './resources/backend/modules/meinModul/_index.js';

[coming soon]
