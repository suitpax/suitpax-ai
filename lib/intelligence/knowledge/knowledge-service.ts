import { VectorStoreIndex, Document, Settings } from "llamaindex"

export interface KnowledgeDocument {
  id: string
  content: string
  metadata: {
    type: "travel_policy" | "destination_guide" | "company_info"
    title: string
    category?: string
    lastUpdated: string
  }
}

export class SuitpaxKnowledgeService {
  private vectorIndex: VectorStoreIndex | null = null
  private documents: KnowledgeDocument[] = []

  constructor() {
    // Configure LlamaIndex settings
    Settings.llm = null // We'll use Anthropic through AI SDK instead
  }

  async initializeKnowledgeBase(documents: KnowledgeDocument[]) {
    try {
      this.documents = documents
      const llamaDocs = documents.map(
        (doc) =>
          new Document({
            text: doc.content,
            metadata: doc.metadata,
          }),
      )

      this.vectorIndex = await VectorStoreIndex.fromDocuments(llamaDocs)
      return true
    } catch (error) {
      console.error("Error initializing knowledge base:", error)
      return false
    }
  }

  async addDocument(document: KnowledgeDocument) {
    try {
      this.documents.push(document)

      if (this.vectorIndex) {
        const llamaDoc = new Document({
          text: document.content,
          metadata: document.metadata,
        })
        await this.vectorIndex.insert(llamaDoc)
      }

      return true
    } catch (error) {
      console.error("Error adding document:", error)
      return false
    }
  }

  async searchKnowledge(query: string, limit = 3): Promise<KnowledgeDocument[]> {
    if (!this.vectorIndex) {
      console.warn("Knowledge base not initialized")
      return []
    }

    try {
      const retriever = this.vectorIndex.asRetriever({ similarityTopK: limit })
      const relevantNodes = await retriever.retrieve(query)

      return relevantNodes.map((node) => ({
        id: node.id_ || "",
        content: node.text,
        metadata: node.metadata as any,
      }))
    } catch (error) {
      console.error("Error searching knowledge:", error)
      return []
    }
  }

  async getTravelPolicies(): Promise<KnowledgeDocument[]> {
    return this.documents.filter((doc) => doc.metadata.type === "travel_policy")
  }

  async getDestinationGuides(): Promise<KnowledgeDocument[]> {
    return this.documents.filter((doc) => doc.metadata.type === "destination_guide")
  }
}
