import conf from "../conf/conf.js"
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service{
    client = new Client()
    databases;
    bucket;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectID);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, featured_image, status, userid}){
        try{

            return await this.databases.createDocument(
                        conf.appwritteDatabaseID, 
                        conf.appwriteCollectionID,
                        slug,
                        {
                            title,
                            content,
                            featured_image,
                            status,
                            userid
                        }
                    )

        } catch(error){
            console.log("Appwrite createPost error:", error)
        }
    }

    async updatePost(slug, {title, content, featured_image, status}){
        try{
            return await this.databases.updateDocument(
                conf.appwritteDatabaseID,
                conf.appwriteCollectionID,
                slug,
                {
                    title,
                    content,
                    featured_image,
                    status
                }
            )
        } catch(error){
            console.log("Appwrite updatePost error:", error)
        }
    }

    async deletePost(slug){
        try{
            await this.databases.deleteDocument(
                conf.appwritteDatabaseID,
                conf.appwriteCollectionID,
                slug
            )
            return true
        } catch(error){
            console.log("Appwrite deletePost error:", error)
            return false
        }
    } 

    async getPost(slug){
        try{
            return await this.databases.getDocument(
                conf.appwritteDatabaseID,
                conf.appwriteCollectionID,
                slug
            )
        } catch(error){
            console.log("Appwrite getPost error:", error)
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {return await this.databases.listDocuments(
                conf.appwritteDatabaseID,
                conf.appwriteCollectionID,
                queries
        );
        } catch(error){
            console.log("Appwrite getPosts error:", error)
        }
    }

    // file upload service

    async uploadFile(file){
        try{
            return await this.bucket.createFile(
                conf.appwriteBucketID,
                ID.unique(),
                file
            )
        } catch(error){
            console.log("Appwrite uploadFile error:", error)
            return false
        }
    }

    async deleteFile(fileID){
        try{
            await this.bucket.deleteFile(
                conf.appwriteBucketID,
                fileID
            )
            return true
        } catch(error){
            console.log("Appwrite deleteFile error:", error)
            return false
        }
    }

    getfilePreview(fileID){
        return this.bucket.getFilePreview(
            conf.appwriteBucketID,
            fileID
        )
    }
    
}


const service = new Service()

export default service