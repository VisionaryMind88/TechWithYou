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

Voor gedetailleerde instructies over het opzetten van de Supabase database, zie [docs/supabase-setup.md](docs/supabase-setup.md).

Samenvatting:
1. Maak een Supabase project aan
2. Kopieer de Connection Pooling URL
3. Voeg de URL toe als DATABASE_URL in je `.env` bestand

## Firebase configuratie

Om Firebase authenticatie te configureren:

1. Ga naar de [Firebase console](https://console.firebase.google.com/) en maak een nieuw Firebase project
2. Klik op "Add app" en selecteer het Web platform (/>)
3. Ga naar de "Authentication" sectie, schakel de Google aanmeldingsmethode in
4. Voeg de applicatie URL toe aan de "Authorized domains" lijst
5. Kopieer de Firebase configuratiegegevens naar je `.env` bestand

## Deployment met Railway

Voor gedetailleerde instructies over deployment naar Railway, zie [docs/railway-deployment.md](docs/railway-deployment.md).

Samenvatting:
1. Maak een Railway project aan en koppel je GitHub repository
2. Configureer alle benodigde environment variabelen
3. De applicatie wordt automatisch gebouwd en gedeployed
4. De health check endpoint op `/api/health` wordt gebruikt om de status te monitoren

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