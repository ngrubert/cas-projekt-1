-------------------
CAS FEE - Projekt 1
-------------------

Aufgabenstellung
================

Erstellen einer Notizenapplikation

- Das Projekt sollte gut strukturiert sein aber weitgehend auf die Nutzung von Frameworks verzichten
   - Nutzung eines SPA Frameworks (Angular 2 oder React+...) nicht erlaubt
       - Nutzung des MVC Patterns trotzdem sinnvoll
   - Nutzung von Layout / Styling-Framework wie Bootstrap nicht erlaubt
       - Flexbox nutzen
   - Nutzung von simpler Templating Engine (z.B. Handlebars) erlaubt / empfohlen
   - Nutzung von JQuery ist erlaubt

- Ältere Browser müssen nicht unterstützt werden.



ToDos:
======
- Stylesheet umschaltbar machen
- Edit Funktion implementieren
- Funktionen in einzelne Module auslagern
  Email von Michael Gfeller dazu:
    Mit dem Module-Pattern und Namespace Pattern könnt ihr euren Code auf dem Client strukturieren.
    Definiert für das Speichern und Laden vom LocalStorage ein eigenes Modul. Zusätzlich könnt ihr noch einen Namespace verwenden um Namenskonflikte zu vermeiden.
    Ein weiteres Modul kann das LocalStorage -Modul verwenden um die Todos zu verwalten. Z.B. TodoService.
    Dieser Umbau hilft um später den Server anzubinden.