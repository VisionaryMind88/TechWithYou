# Supabase Setup Instructies voor TechWithYou

Dit document bevat instructies voor het opzetten van een Supabase database voor de TechWithYou applicatie.

## Supabase Project Aanmaken

1. Ga naar de [Supabase dashboard](https://supabase.com/dashboard/projects)
2. Klik op "New Project"
3. Kies een naam voor je project (bijvoorbeeld "techwithyou-production")
4. Stel een database wachtwoord in (bewaar dit zorgvuldig)
5. Kies een regio die dicht bij je gebruikers is (Europa voor NL gebruikers)
6. Klik op "Create new project"

## Database URL Ophalen

Nadat je project is aangemaakt, kun je de database URL als volgt ophalen:

1. Ga naar de [Supabase dashboard](https://supabase.com/dashboard/projects)
2. Selecteer je project
3. Klik op het "Settings" icoon in de linkerzijbalk, en kies "Database"
4. Scroll naar het "Connection Pooling" gedeelte
5. Kopieer de "Connection string" URL
6. Vervang `[YOUR-PASSWORD]` in de URL met je databasewachtwoord

De URL ziet er ongeveer zo uit:
```
postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijkl.supabase.co:5432/postgres
```

## Environment Variables Configureren

1. Voeg de Supabase database URL toe aan je `.env` bestand als `DATABASE_URL`
2. Voor Railway deployment, voeg de URL toe aan je Railway project environment variables

## Database Schema Opzetten

De applicatie zal automatisch het schema opzetten bij de eerste keer opstarten. Je hoeft hiervoor niets extra's te doen.

## Security Instellingen

1. Ga naar "Authentication" in je Supabase dashboard
2. Zorg ervoor dat alleen de authenticatiemethoden die je wilt gebruiken zijn ingeschakeld
3. Voeg je domein toe aan "Redirect URLs" en "Allowed domains" voor authenticatie
4. Bij "Database" instellingen, zorg ervoor dat Row Level Security (RLS) is ingeschakeld