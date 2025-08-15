// Lightweight in-memory knowledge service to avoid heavy deps during build

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
  private documents: KnowledgeDocument[] = []

  async initializeKnowledgeBase(documents: KnowledgeDocument[]) {
    try {
      this.documents = documents
      return true
    } catch (error) {
      console.error("Error initializing knowledge base:", error)
      return false
    }
  }

  async addDocument(document: KnowledgeDocument) {
    try {
      this.documents.push(document)

      return true
    } catch (error) {
      console.error("Error adding document:", error)
      return false
    }
  }

  async searchKnowledge(query: string, limit = 3): Promise<KnowledgeDocument[]> {
    try {
      const q = query.toLowerCase()
      const results = this.documents
        .map((doc) => ({
          doc,
          score:
            (doc.metadata.title.toLowerCase().includes(q) ? 2 : 0) +
            (doc.content.toLowerCase().includes(q) ? 1 : 0) +
            (doc.metadata.category?.toLowerCase().includes(q) ? 1 : 0),
        }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((r) => r.doc)
      return results
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
