import { NextResponse , NextRequest} from "next/server";
import connectDB from "@/lib/db";
import bcryptjs from 'bcryptjs'
export async function POST(request:NextRequest){
    try {
        const connection = await connectDB();
        const req= await request.json()
        const { email, password } = req;
        
        let query: string = 'SELECT * FROM users WHERE email =?';
        const [result]= await connection.execute(query, [email ]);
        const rows = result as any[];
        console.log("start",rows , "rowss")
        if (rows.length) {
            return NextResponse.json({ message: 'User already exists' },{status:400});
          
       } 
       else{

           const salt = await bcryptjs.genSalt(10);
           const hashedpassword = await bcryptjs.hash(password , salt);
           query = 'INSERT INTO users(email,password) VALUES(?,?)';
           const newUser = await connection.execute(query,[email,hashedpassword])
           console.log(newUser)
           return NextResponse.json({ message: 'new user' },{status:400});
        }



        connection.end();

    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500})
    }
}