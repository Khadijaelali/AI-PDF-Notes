import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { api } from "./_generated/api.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    // Log pour vérifier les données envoyées à l'ingestion
    console.log('Démarrage de l\'ingestion pour le fileId:', args.fileId);
    console.log('Textes à ingérer:', args.splitText);

    // Vérifier si les données sont vides
    if (!args.splitText || args.splitText.length === 0) {
      console.warn('Aucun texte à ingérer.');
      return "Aucun texte à ingérer.";
    }

    // Ingestion dans le ConvexVectorStore
    await ConvexVectorStore.fromTexts(
      args.splitText, // Texte à ingérer
      { fileId: args.fileId }, // Métadonnée
      new GoogleGenerativeAIEmbeddings({
        apiKey: 'AIzaSyDY5CIlGdABHyyL3Hj_RKL12uDTZljtD3c', // Replace with a secure key
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    console.log('Ingestion terminée.');
    return "Ingestion terminée.";
  },
});


export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log('Démarrage de la recherche pour le query:', args.query);
    console.log('fileId pour la recherche:', args.fileId);

    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: 'AIzaSyDY5CIlGdABHyyL3Hj_RKL12uDTZljtD3c', // Replace with a secure key
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    // Log avant la recherche pour vérifier le contenu du vector store
    console.log('Vérification du contenu du vector store avant la recherche');

    const resultOne = await (await vectorStore.similaritySearch(args.query, 1))
      .filter(q => q.metadata.fileId === args.fileId);

    // Log des résultats de la recherche
    console.log('Résultats de la recherche avant filtration:', resultOne);

    // Si aucun résultat trouvé, afficher un message
    if (!resultOne || resultOne.length === 0) {
      console.warn('Aucun résultat trouvé pour cette recherche.');
    }

    // Log du résultat formaté
    console.log('Résultats de la recherche:', resultOne);

    return JSON.stringify(resultOne);
  },
});
