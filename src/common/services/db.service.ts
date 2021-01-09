import { Injectable } from '@nestjs/common';
import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../../../serviceAccountKey.json';

interface IQuery {
  id: string;
  [key: string]: unknown;
}
@Injectable()
export class OrdersService {
  private db: FirebaseFirestore.Firestore;

  constructor() {
    this.initDb();
  }

  private initDb() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL: 'https://construyo-coding-challenge.firebaseio.com',
    });

    this.db = admin.firestore();
  }

  public async createDocument<T extends unknown>(collection: string, dto: T) {
    const result = await this.db.collection(collection).add(dto);
    return result;
  }

  public async getDocumentById(collection: string, id: string) {
    const queryResult = await this.db.collection(collection).doc(id).get();

    return queryResult.data();
  }

  public async getAllDocuments<T extends IQuery>(
    collection: string,
  ): Promise<T[]> {
    const result: T[] = [];
    const queryResult = await this.db.collection(collection).get();
    queryResult.forEach((doc) => {
      const data = doc.data() as T;
      data.id = doc.id;
      result.push(data);
    });
    return result;
  }
}
