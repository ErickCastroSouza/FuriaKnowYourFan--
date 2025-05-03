import { 
  users, 
  documents, 
  products, 
  events,
  news,
  streamers,
  team,
  type User, 
  type InsertUser, 
  type UpdateUser,
  type Document,
  type InsertDocument,
  type Product,
  type Event,
  type News,
  type Streamer,
  type TeamMember
} from "@shared/schema";

import { db } from "./db";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<UpdateUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Document operations
  saveDocument(doc: Omit<InsertDocument, "verified" | "createdAt">): Promise<Document>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getPersonalizedProducts(user: User): Promise<Product[]>;
  
  // Event operations
  getEvents(): Promise<Event[]>;
  getPersonalizedEvents(user: User): Promise<Event[]>;
  
  // News operations
  getNews(): Promise<News[]>;
  getPersonalizedNews(user: User): Promise<News[]>;
  
  // Team operations
  getTeam(): Promise<TeamMember[]>;
  
  // Streamer operations
  getLiveStreamers(): Promise<Streamer[]>;
  
  // Admin stats
  getUserStats(timeframe: string): Promise<{
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    conversionRate: number;
  }>;
  getUsersByInterest(timeframe: string): Promise<Array<{ name: string; value: number }>>;
  getUsersByLocation(timeframe: string): Promise<Array<{ name: string; value: number }>>;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private documentsMap: Map<number, Document>;
  private productsMap: Map<number, Product>;
  private eventsMap: Map<number, Event>;
  private newsMap: Map<number, News>;
  private streamersMap: Map<number, Streamer>;
  private teamMap: Map<number, TeamMember>;
  private currentUserId: number;
  private currentDocumentId: number;
  private currentProductId: number;
  private currentEventId: number;
  private currentNewsId: number;
  private currentStreamerId: number;
  private currentTeamId: number;

  constructor() {
    this.usersMap = new Map();
    this.documentsMap = new Map();
    this.productsMap = new Map();
    this.eventsMap = new Map();
    this.newsMap = new Map();
    this.streamersMap = new Map();
    this.teamMap = new Map();
    
    this.currentUserId = 1;
    this.currentDocumentId = 1;
    this.currentProductId = 1;
    this.currentEventId = 1;
    this.currentNewsId = 1;
    this.currentStreamerId = 1;
    this.currentTeamId = 1;
    
    // Initialize with admin user
  }

  private async initializeData() {
    // Initialize products
    const productData: Omit<Product, "id">[] = [
      {
        name: "FURIA Pro Jersey 2023",
        price: 24990, // in cents
        image: "https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_960_720.jpg",
        category: "apparel",
        description: "Official FURIA team jersey for 2023 season",
        featured: true,
        createdAt: new Date()
      },
      {
        name: "FURIA Black Hoodie",
        price: 19990,
        image: "https://cdn.pixabay.com/photo/2017/01/11/08/31/icon-1971128_960_720.jpg",
        category: "apparel",
        description: "Comfortable black hoodie with FURIA logo",
        featured: true,
        createdAt: new Date()
      },
      {
        name: "FURIA Panthera Cap",
        price: 8990,
        image: "https://cdn.pixabay.com/photo/2017/05/13/12/40/fashion-2309519_960_720.jpg",
        category: "accessories",
        description: "Adjustable cap with FURIA Panthera logo",
        featured: true,
        createdAt: new Date()
      },
      {
        name: "FURIA Pro Gaming Mousepad XL",
        price: 11990,
        image: "https://cdn.pixabay.com/photo/2016/11/19/15/32/laptop-1839876_960_720.jpg",
        category: "accessories",
        description: "Extra large gaming mousepad with FURIA design",
        featured: true,
        createdAt: new Date()
      }
    ];
    
    for (const product of productData) {
      const id = this.currentProductId++;
      this.productsMap.set(id, { ...product, id });
    }
    
    // Initialize events
    const eventData: Omit<Event, "id">[] = [
      {
        name: "ESL Pro League Season 17",
        location: "Malta, Europe",
        startDate: new Date("2023-03-23"),
        endDate: new Date("2023-04-02"),
        image: "https://cdn.pixabay.com/photo/2019/11/10/17/36/trace-4616372_960_720.jpg",
        description: "Premier CS:GO tournament featuring top teams from around the world",
        category: "csgo",
        createdAt: new Date()
      },
      {
        name: "BLAST Premier Spring Final",
        location: "Washington, USA",
        startDate: new Date("2023-05-15"),
        endDate: new Date("2023-05-21"),
        image: "https://cdn.pixabay.com/photo/2016/11/29/09/16/abstract-1868928_960_720.jpg",
        description: "Spring finale of the BLAST Premier circuit",
        category: "csgo",
        createdAt: new Date()
      },
      {
        name: "IEM Cologne 2023",
        location: "Cologne, Germany",
        startDate: new Date("2023-07-18"),
        endDate: new Date("2023-07-30"),
        image: "https://cdn.pixabay.com/photo/2017/03/12/02/20/triangle-polygon-2136288_960_720.jpg",
        description: "The Cathedral of Counter-Strike returns to Cologne",
        category: "csgo",
        createdAt: new Date()
      },
      {
        name: "Major Rio 2023",
        location: "Rio de Janeiro, Brasil",
        startDate: new Date("2023-10-30"),
        endDate: new Date("2023-11-12"),
        image: "https://cdn.pixabay.com/photo/2016/12/08/02/01/gradient-1890632_960_720.jpg",
        description: "CS:GO Major Championship in Brazil",
        category: "csgo",
        createdAt: new Date()
      }
    ];
    
    for (const event of eventData) {
      const id = this.currentEventId++;
      this.eventsMap.set(id, { ...event, id });
    }
    
    // Initialize news
    const newsData: Omit<News, "id">[] = [
      {
        title: "FURIA se classifica para o Major de Berlim",
        summary: "A equipe brasileira garantiu sua vaga no próximo Major após uma campanha impressionante nas eliminatórias regionais.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.",
        image: "https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_960_720.jpg",
        date: new Date("2023-05-10"),
        category: "csgo",
        featured: true
      },
      {
        title: "Nova coleção de merchandise disponível na loja",
        summary: "A FURIA lança sua nova coleção de roupas e acessórios com design exclusivo inspirado na identidade visual da equipe.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.",
        image: "https://cdn.pixabay.com/photo/2016/08/20/09/59/desktop-1607903_960_720.jpg",
        date: new Date("2023-05-05"),
        category: "merch",
        featured: true
      },
      {
        title: "FURIA anuncia nova divisão de League of Legends",
        summary: "A organização expande seu portfólio de equipes com a aquisição de um time completo para competir no CBLOL 2023.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.",
        image: "https://cdn.pixabay.com/photo/2020/06/29/21/13/desktop-5354044_960_720.jpg",
        date: new Date("2023-04-28"),
        category: "lol",
        featured: false
      }
    ];
    
    for (const item of newsData) {
      const id = this.currentNewsId++;
      this.newsMap.set(id, { ...item, id });
    }
    
    // Initialize team members
    const teamData: Omit<TeamMember, "id">[] = [
      {
        name: "arT",
        role: "Team Captain",
        image: "https://cdn.pixabay.com/photo/2016/11/29/13/26/crowd-1870013_960_720.jpg",
        bio: "Team captain and in-game leader for FURIA CS:GO",
        socialMedia: { twitter: "arTcsgo", instagram: "arTcsgo" },
        game: "csgo"
      },
      {
        name: "KSCERATO",
        role: "Rifler",
        image: "https://cdn.pixabay.com/photo/2017/06/10/07/18/gaming-2389215_960_720.jpg",
        bio: "Star rifler for FURIA CS:GO",
        socialMedia: { twitter: "kscerato", instagram: "kscerato" },
        game: "csgo"
      },
      {
        name: "yuurih",
        role: "Rifler",
        image: "https://cdn.pixabay.com/photo/2018/05/02/16/37/esports-3369637_960_720.jpg",
        bio: "Support rifler for FURIA CS:GO",
        socialMedia: { twitter: "yuurihcs", instagram: "yuurihcs" },
        game: "csgo"
      },
      {
        name: "drop",
        role: "Support",
        image: "https://cdn.pixabay.com/photo/2015/05/28/20/08/student-788588_960_720.jpg",
        bio: "Support player for FURIA CS:GO",
        socialMedia: { twitter: "drop", instagram: "drop" },
        game: "csgo"
      },
      {
        name: "saffee",
        role: "AWPer",
        image: "https://cdn.pixabay.com/photo/2016/11/23/00/32/man-1851469_960_720.jpg",
        bio: "Main AWPer for FURIA CS:GO",
        socialMedia: { twitter: "saffee", instagram: "saffee" },
        game: "csgo"
      }
    ];
    
    for (const member of teamData) {
      const id = this.currentTeamId++;
      this.teamMap.set(id, { ...member, id });
    }
    
    // Initialize streamers
    const streamerData: Omit<Streamer, "id">[] = [
      {
        username: "FURIA_Player1",
        title: "Treinando para o próximo torneio!",
        thumbnail: "https://cdn.pixabay.com/photo/2020/05/11/15/38/programming-5158624_960_720.jpg",
        viewers: 1200,
        isLive: true,
        updatedAt: new Date()
      },
      {
        username: "FURIA_Player2",
        title: "Jogando com o time",
        thumbnail: "https://cdn.pixabay.com/photo/2021/09/07/07/11/game-6603047_960_720.jpg",
        viewers: 1200,
        isLive: true,
        updatedAt: new Date()
      },
      {
        username: "FURIA_Player3",
        title: "Stream com fãs - vem jogar!",
        thumbnail: "https://cdn.pixabay.com/photo/2022/10/30/16/08/streamers-7557669_960_720.jpg",
        viewers: 1200,
        isLive: true,
        updatedAt: new Date()
      }
    ];
    
    for (const streamer of streamerData) {
      const id = this.currentStreamerId++;
      this.streamersMap.set(id, { ...streamer, id });
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
    console.log(this.usersMap)
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
  
    const [createdUser] = await db.insert(users).values({
      ...insertUser,
      isAdmin: false,
      createdAt: now,
      lastLogin: now,
      gameInterests: [], // dependendo do seu schema, talvez precise serializar
    }).returning();
  
    return createdUser;
  }

  async updateUser(id: number, data: Partial<UpdateUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) {
      return undefined;
    }

    const updatedUser = { ...user, ...data };
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }

  async saveDocument(doc: Omit<InsertDocument, "verified" | "createdAt">): Promise<Document> {
    const id = this.currentDocumentId++;
    const now = new Date();
    const document: Document = {
      ...doc,
      id,
      verified: false,
      createdAt: now
    };
    this.documentsMap.set(id, document);
    return document;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.usersMap.values());
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.productsMap.values());
  }

  async getPersonalizedProducts(user: User): Promise<Product[]> {
    // For now, return all products
    // In a real app, we would filter based on user interests
    return this.getProducts();
  }

  async getEvents(): Promise<Event[]> {
    return Array.from(this.eventsMap.values());
  }

  async getPersonalizedEvents(user: User): Promise<Event[]> {
    // For now, return all events
    // In a real app, we would filter based on user interests
    return this.getEvents();
  }

  async getNews(): Promise<News[]> {
    return Array.from(this.newsMap.values());
  }

  async getPersonalizedNews(user: User): Promise<News[]> {
    // For now, return all news
    // In a real app, we would filter based on user interests
    return this.getNews();
  }

  async getTeam(): Promise<TeamMember[]> {
    return Array.from(this.teamMap.values());
  }

  async getLiveStreamers(): Promise<Streamer[]> {
    return Array.from(this.streamersMap.values()).filter(streamer => streamer.isLive);
  }

  async getUserStats(timeframe: string): Promise<{
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    conversionRate: number;
  }> {
    const users = await this.getAllUsers();
    const now = new Date();
    
    let filteredUsers = users;
    
    // Apply timeframe filter
    if (timeframe !== "all") {
      let cutoffDate = new Date();
      
      switch (timeframe) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filteredUsers = users.filter(user => user.createdAt && user.createdAt >= cutoffDate);
    }
    
    // For demo purposes, calculate some stats
    const totalUsers = users.length;
    const newUsers = filteredUsers.length;
    
    // Consider users active if they've logged in during the timeframe
    let activeUsers = 0;
    if (timeframe !== "all") {
      let cutoffDate = new Date();
      
      switch (timeframe) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      activeUsers = users.filter(user => user.lastLogin && user.lastLogin >= cutoffDate).length;
    } else {
      activeUsers = Math.round(totalUsers * 0.7); // 70% active as demo
    }
    
    // Calculate conversion as percentage of users with complete profiles
    const usersWithCompleteProfiles = users.filter(user => 
      user.fullName && user.email && user.phoneNumber
    ).length;
    
    const conversionRate = totalUsers > 0 
      ? Math.round((usersWithCompleteProfiles / totalUsers) * 100) 
      : 0;
    
    return {
      totalUsers,
      newUsers,
      activeUsers,
      conversionRate
    };
  }

  async getUsersByInterest(timeframe: string): Promise<Array<{ name: string; value: number }>> {
    const users = await this.getAllUsers();
    const now = new Date();
    
    let filteredUsers = users;
    
    // Apply timeframe filter
    if (timeframe !== "all") {
      let cutoffDate = new Date();
      
      switch (timeframe) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filteredUsers = users.filter(user => user.createdAt && user.createdAt >= cutoffDate);
    }
    
    // Count interests
    const interests = new Map<string, number>();
    
    for (const user of filteredUsers) {
      if (user.gameInterests && user.gameInterests.length > 0) {
        for (const interest of user.gameInterests) {
          interests.set(interest, (interests.get(interest) || 0) + 1);
        }
      } else if (user.preferredGame) {
        // If no interests but has preferred game
        interests.set(user.preferredGame, (interests.get(user.preferredGame) || 0) + 1);
      } else {
        // Default to "Other" if no interests or preferred game
        interests.set("Other", (interests.get("Other") || 0) + 1);
      }
    }
    
    // Convert to array of objects
    const interestArray: Array<{ name: string; value: number }> = [];
    
    for (const [name, value] of interests.entries()) {
      interestArray.push({ name, value });
    }
    
    // If no real data, use placeholder data
    if (interestArray.length === 0) {
      return [
        { name: "CS:GO", value: 45 },
        { name: "Valorant", value: 28 },
        { name: "League of Legends", value: 15 },
        { name: "Apex Legends", value: 8 },
        { name: "Free Fire", value: 4 }
      ];
    }
    
    return interestArray;
  }

  async getUsersByLocation(timeframe: string): Promise<Array<{ name: string; value: number }>> {
    const users = await this.getAllUsers();
    const now = new Date();
    
    let filteredUsers = users;
    
    // Apply timeframe filter
    if (timeframe !== "all") {
      let cutoffDate = new Date();
      
      switch (timeframe) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filteredUsers = users.filter(user => user.createdAt && user.createdAt >= cutoffDate);
    }
    
    // Count locations
    const locations = new Map<string, number>();
    
    for (const user of filteredUsers) {
      if (user.state) {
        locations.set(user.state, (locations.get(user.state) || 0) + 1);
      } else {
        // Default to "Unknown" if no state
        locations.set("Unknown", (locations.get("Unknown") || 0) + 1);
      }
    }
    
    // Convert to array of objects
    const locationArray: Array<{ name: string; value: number }> = [];
    
    for (const [name, value] of locations.entries()) {
      locationArray.push({ name, value });
    }
    
    // If no real data, use placeholder data
    if (locationArray.length === 0) {
      return [
        { name: "São Paulo", value: 420 },
        { name: "Rio de Janeiro", value: 240 },
        { name: "Minas Gerais", value: 186 },
        { name: "Rio Grande do Sul", value: 98 },
        { name: "Bahia", value: 62 }
      ];
    }
    
    return locationArray;
  }
}

export const storage = new MemStorage();
