# Railway Deployment Instructies voor TechWithYou

Dit document bevat instructies voor het deployen van de TechWithYou applicatie op Railway.

## Vereisten

1. Een Railway account (registreer op [railway.app](https://railway.app))
2. Een Supabase database (zie `docs/supabase-setup.md`)
3. Een GitHub repository met de projectcode

## Railway Project Aanmaken

1. Log in op je [Railway dashboard](https://railway.app/dashboard)
2. Klik op "New Project"
3. Kies "Deploy from GitHub repo"
4. Selecteer je GitHub repository
5. Klik op "Deploy Now"

## Environment Variables Configureren

Voeg de volgende environment variables toe aan je Railway project via het "Variables" tabblad:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijkl.supabase.co:5432/postgres
PORT=5000
NODE_ENV=production
SESSION_SECRET=[GENEREER-EEN-VEILIGE-STRING]
OPENAI_API_KEY=[JE-OPENAI-API-KEY]
VITE_OPENAI_API_KEY=[JE-OPENAI-API-KEY]
VITE_FIREBASE_API_KEY=[FIREBASE-API-KEY]
VITE_FIREBASE_AUTH_DOMAIN=[PROJECT-ID].firebaseapp.com
VITE_FIREBASE_PROJECT_ID=[PROJECT-ID]
VITE_FIREBASE_STORAGE_BUCKET=[PROJECT-ID].appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=[SENDER-ID]
VITE_FIREBASE_APP_ID=[APP-ID]
VITE_GA_MEASUREMENT_ID=[GA-MEASUREMENT-ID]
```

Vervang de waarden tussen vierkante haken met je eigen gegevens.

## Automatische Deployment Configureren

Railway gebruikt de `railway.json` configuratie die al in het project zit. Hier zijn de belangrijkste instellingen:

- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Health Check Path**: `/api/health`
- **Node Environment**: `production`

De applicatie zal automatisch herbouwen en herdeployen wanneer er nieuwe code naar de main/master branch wordt gepusht.

## Domein Configureren

1. Ga naar het "Settings" tabblad van je Railway project
2. Scroll naar het "Domains" gedeelte
3. Klik op "Generate Domain" om een railway.app subdomain te genereren
4. Of klik op "Custom Domain" om je eigen domein toe te voegen

## Monitoring en Logs

1. Ga naar het "Deployments" tabblad om recente deployments te bekijken
2. Klik op een specifieke deployment om logs te bekijken
3. Gebruik het "Metrics" tabblad om CPU, geheugen, en netwerkgebruik te monitoren

## Scaling Configureren

De applicatie is al geconfigureerd voor automatische scaling in `railway.json`:

```json
"scaling": {
  "minInstances": 1,
  "maxInstances": 3,
  "autoScaling": true
}
```

Je kunt deze waarden aanpassen via het "Settings" tabblad indien nodig.

## Troubleshooting

Als je deployment problemen ondervindt:

1. Controleer de logs in het "Deployments" tabblad
2. Zorg ervoor dat alle environment variables correct zijn ingesteld
3. Controleer of de health check endpoint (`/api/health`) correct reageert
4. Controleer de connectie met de Supabase database