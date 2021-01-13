import { Injectable } from '@nestjs/common';
import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../../../serviceAccountKey.json';

interface ICommonQuery {
  [key: string]: unknown;
}
interface IQuery extends ICommonQuery {
  id: string;
}
@Injectable()
export class DBService {
  private db: FirebaseFirestore.Firestore;
  private auth: admin.auth.Auth;

  constructor() {
    this.initDb();
  }

  private initDb() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL: 'https://construyo-coding-challenge.firebaseio.com',
    });

    this.db = admin.firestore();
    this.auth = admin.auth();
  }

  public async createDocument<T extends unknown>(collection: string, dto: T) {
    // TODO: handle errors
    const result = await this.db.collection(collection).add(dto);
    return result.id;
  }

  public async getDocumentById(collection: string, id: string) {
    const queryResult = await this.db.collection(collection).doc(id).get();
    if (!queryResult.exists) {
      return null;
    }
    return queryResult.data();
  }

  public async updateDocumentById<T extends ICommonQuery>(
    collection: string,
    id: string,
    updateData: T,
  ) {
    try {
      const updateResult = await this.db
        .collection(collection)
        .doc(id)
        .update(updateData);
      return updateResult;
    } catch (error) {
      // TODO: Analyze errors
      console.log(error.code);
      if (error.code === 5) {
        return null;
      }
      throw new Error();
    }
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

  public async verifyTokenAndGetUID(token: string): Promise<string> {
    const decodedToken = await this.auth.verifyIdToken(token);
    return decodedToken.uid;
  }
}
