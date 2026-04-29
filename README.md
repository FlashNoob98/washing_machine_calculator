# Ritardo Lavastoviglie

Questa è una semplice app web per calcolare quando avviare la lavastoviglie in modo da farla finire all'orario desiderato.

## Come usare

1. Apri `index.html` in un browser.
2. Attendi che l'app ottenga l'ora locale da Internet.
3. Inserisci la durata del programma della lavastoviglie.
4. Inserisci l'orario in cui vuoi che il programma termini.
5. Premi `Calcola ritardo`.

## Note

- L'app prova a leggere l'ora da `https://worldtimeapi.org/api/ip`.
- Se il recupero dell'ora fallisce, viene usato l'orologio del dispositivo.
