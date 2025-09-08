import connect from "@/lib/db";
import User from "@/lib/modals/users";
import Category from "@/lib/modals/categories";
import { NextResponse } from "next/server"
import { Types } from "mongoose";

export const PATCH = async (request: Request, context: { params: any }) => {
    try {
        const categoryId = context.params.category;
        const body = await request.json();
        const title = body.title;

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "User ID not found or invalid" }), { status: 400 }
            );
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(
                JSON.stringify({message: "Category ID not found or invalid"}), {status :400}
            );
        }

        await connect();

        const user = await User.findById(userId);
        if(!user){
            return new NextResponse(
                JSON.stringify({message:"User not found in the database"}), {status: 400}
            );
        }

        const category = await Category.findOne({_id: categoryId, user: userId});
        if(!category){
            return new NextResponse(
                JSON.stringify({message:"Category not found in the database"}), {status: 400}
            );
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            title,
            { new: true },
        );

        return new NextResponse(JSON.stringify({message: "Category updated"}), {status:200});
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error updating cateogory" }), { status: 500 });
    }
}

export const DELETE = async (request: Request, context: { params: any }) => {
    try {
        const categoryId = context.params.category;

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "User ID not found or invalid" }), { status: 400 }
            );
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(
                JSON.stringify({message: "Category ID not found or invalid"}), {status :400}
            );
        }

        await connect();

        const user = await User.findById(userId);
        if(!user){
            return new NextResponse(
                JSON.stringify({message:"User not found in the database"}), {status: 400}
            );
        }

        const category = await Category.findOne({_id: categoryId, user: userId});
        if(!category){
            return new NextResponse(
                JSON.stringify({message:"Category not found in the database or does not belong to the user"}), {status: 400}
            );
        }

        await Category.findOneAndDelete(categoryId);

        return new NextResponse(JSON.stringify({message: "Category deleted"}), {status:200});
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error updating cateogory" }), { status: 500 });
    }
}