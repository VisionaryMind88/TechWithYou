# TechWithYou Webapplicatie

Een geavanceerde professionele website voor TechWithYou die diensten aanbiedt voor het bouwen van high-quality, professionele websites, applicaties en dashboards voor bedrijven.

## Technologieën

- React.js met Wouter routing
- TypeScript
- Firebase Authenticatie
- Geavanceerde SEO implementatie
- Project management API
- Responsive UI componenten
- Modulaire component architectuur
- Meertalige chatbot ondersteuning
- Meertalige content beheer
- PostgreSQL database integratie via Supabase

## Lokale ontwikkeling

1. Installeer de dependencies:
   ```bash
   npm install
   ```

2. Maak een `.env` bestand aan op basis van het `.env.example` bestand:
   ```bash
   cp .env.example .env
   ```

3. Vul de benodigde environment variabelen in, inclusief de DATABASE_URL voor Supabase.

4. Start de ontwikkelomgeving:
   ```bash
   npm run dev
   ```

## Database configuratie

Om de Supabase database te configureren:

1. Ga naar de [Supabase dashboard](https://supabase.com/dashboard/projects)
2. Maak een nieuw project aan
3. Zodra je op de projectpagina bent, klik op de "Connect" knop in de bovenste werkbalk
4. Kopieer de URI waarde onder "Connection string" -> "Transaction pooler"
5. Vervang `[YOUR-PASSWORD]` met het databasewachtwoord dat je hebt ingesteld voor het project
6. Voeg deze URL toe als DATABASE_URL in je `.env` bestand

## Firebase configuratie

Om Firebase authenticatie te configureren:

1. Ga naar de [Firebase console](https://console.firebase.google.com/) en maak een nieuw Firebase project.
2. Klik op "Add app" en selecteer het Web platform (/>).
3. Ga naar de "Authentication" sectie in de nieuwe Firebase app, schakel de Google aanmeldingsmethode in, en klik op opslaan.
4. Voeg de Repl's Dev URL toe aan de "Authorized domains" lijst in de Firebase app onder Authentication > Settings > Authorized domains.
5. Kopieer de Firebase configuratiegegevens (apiKey, authDomain, etc.) naar je `.env` bestand.

## Deployment met Railway

Deze applicatie is geconfigureerd voor deployment via Railway:

1. Maak een Railway project aan op [railway.app](https://railway.app/)
2. Verbind je GitHub repository
3. Voeg de benodigde environment variabelen toe:
   - DATABASE_URL: Je Supabase database URL
   - OPENAI_API_KEY: Je OpenAI API sleutel voor de chatbot
   - VITE_FIREBASE_*: Je Firebase configuratiegegevens
   - PORT: 5000
   - NODE_ENV: production

4. Deploy de applicatie:
   - Railway zal automatisch de juiste build en start commando's uitvoeren op basis van de railway.json configuratie
   - De health check endpoint op /api/health zal automatisch worden gebruikt door Railway om de applicatie gezondheid te monitoren

## Projectstructuur

- `client/`: Bevat alle frontend code
  - `src/components/`: UI componenten
  - `src/pages/`: Pagina componenten
  - `src/lib/`: Helper functies
  - `src/hooks/`: Custom React hooks
- `server/`: Bevat alle backend code
  - `routes.ts`: API endpoints
  - `storage.ts`: Database CRUD operaties
  - `auth.ts`: Authenticatie logica
  - `db.ts`: Database connectie configuratie
- `shared/`: Gedeelde code tussen frontend en backend
  - `schema.ts`: Database schema definities met Drizzle ORM

## License

MIT