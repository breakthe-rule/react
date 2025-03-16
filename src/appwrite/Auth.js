import conf from "../conf/conf.js"
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client()
    account;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectID);

        this.account = new Account(this.client)
    }

    async createAccount({email, password, name}){
        try{
            const userAcc = await this.account.create(ID.unique(), email, password, name) 
            if (userAcc){
                return this.login({email, password})
            } else {
                return userAcc
            }
        } catch (error){
            throw error
        }
    }

    async login({email, password}){
        try {
            const session = await this.account.createEmailPasswordSession(email, password);
            return session
        } catch (error) {
            throw error
        }
    }

    async getCurrentUser(){
        try {
            const user = await this.account.get();
            return user
        } catch (err) {
            console.log("Appwrite error:", err)
        }

        return null;
    }

    async logout(){
        try{
            await this.account.deleteSessions();
        } catch(error){
            console.log("Appwrite error:", error)
        }
    }

}

const authService = new AuthService()

export default authService;