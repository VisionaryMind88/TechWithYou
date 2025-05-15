import OpenAI from "openai";

// Initialiseer de OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Gebruik VITE_ prefix voor client-side env vars
  dangerouslyAllowBrowser: true // Staat toe dat we de client in de browser gebruiken met de API-sleutel
});

// Website-specifieke kennis voor de chatbot
const websiteInfo = `
Digitaal Atelier is een professioneel webbureau gespecialiseerd in het bouwen van websites, applicaties, en dashboards voor bedrijven.

Diensten die we aanbieden:
1. Websiteontwikkeling: Moderne, responsieve en gebruiksvriendelijke websites op maat.
2. Applicatieontwikkeling: Web- en mobiele applicaties voor diverse bedrijfsprocessen.
3. Dashboard ontwikkeling: Interactieve dashboards voor data-inzicht en bedrijfsprocessen.
4. UI/UX Design: Gebruiksvriendelijke en esthetisch aantrekkelijke interfaces.
5. Digitale marketing: SEO, content marketing en social media-strategieën.

Procesaanpak:
1. Consultatie: We bespreken uw behoeften en doelen.
2. Ontwerp: We creëren een visueel ontwerp voor goedkeuring.
3. Ontwikkeling: Ons team bouwt uw digitale product.
4. Testen: Rigoureuze tests voor alle functionaliteiten.
5. Launch: Uw project wordt live gezet.
6. Ondersteuning: Doorlopende ondersteuning en updates.

Contactinformatie:
- E-mail: info@digitaalatelier.com
- Telefoon: +31 (0)20 123 4567
- Adres: Amsterdamseweg 123, 1234 AB Amsterdam

Prijsindicatie:
- Eenvoudige websites: vanaf €2.500
- Complexe websites/webshops: vanaf €5.000
- Applicaties: vanaf €7.500
- Maatwerk dashboards: vanaf €4.000

Levertijd:
- Eenvoudige websites: 3-4 weken
- Complexe websites: 8-12 weken
- Applicaties: 12-16 weken
- Dashboards: 6-10 weken
`;

// System prompt voor de chatbot
const chatbotSystemPrompt = `
Je bent Dalia, de virtuele assistent van Digitaal Atelier, een professioneel webbureau.
Je bent vriendelijk, behulpzaam en professioneel. Je antwoorden zijn beknopt maar informatief.

Gebruik deze informatie over het bedrijf om vragen te beantwoorden:
${websiteInfo}

Richtlijnen voor je antwoorden:
1. Stel je altijd voor als "Dalia" als dit het eerste bericht is.
2. Gebruik een professionele maar vriendelijke toon.
3. Geef concrete informatie over diensten, prijzen en levertijden wanneer hier naar gevraagd wordt.
4. Voor complexere vragen of specifieke projectaanvragen, adviseer om contact op te nemen via de contactpagina.
5. Als je een vraag niet kunt beantwoorden, wees eerlijk en bied een alternatief.
6. Houd antwoorden beknopt, niet langer dan 3-4 zinnen.
7. Spreek in het Nederlands tenzij de gebruiker in het Engels communiceert.

Vragen over prijzen handel je tactvol af: geef de prijsindicatie maar benadruk dat de exacte prijs afhangt van de specifieke wensen en eisen.
`;

/**
 * Functie om een AI-chatbotreactie te genereren op basis van de gebruikersinvoer
 * @param message De invoer van de gebruiker
 * @param chatHistory Eerdere berichten voor context
 * @returns De gegenereerde reactie van de AI
 */
export async function generateAIResponse(message: string, chatHistory: { role: string, content: string }[]): Promise<string> {
  try {
    // Volledige chatgeschiedenis inclusief system prompt
    const fullHistory = [
      { role: "system", content: chatbotSystemPrompt },
      ...chatHistory,
      { role: "user", content: message }
    ];

    // Roep de OpenAI API aan
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Gebruik het nieuwste model voor beste prestaties
      messages: fullHistory as any,
      temperature: 0.7, // Balans tussen creativiteit en focus
      max_tokens: 300, // Houd antwoorden relatief kort
    });

    // Extraheer en retourneer de AI-reactie
    return response.choices[0].message.content || "Sorry, ik kon geen antwoord genereren. Probeer het opnieuw.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Sorry, er is een probleem opgetreden bij het genereren van een antwoord. Probeer het later nog eens.";
  }
}