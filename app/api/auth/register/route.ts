import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUsersCollection } from "@/lib/users";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { name, phone, email, password } = body;

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Name, email and password are required",
                },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Password must be at least 6 characters",
                },
                { status: 400 }
            );
        }

        const users = await getUsersCollection();

        // Check existing user
        const existingUser = await users.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User already exists",
                },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            role: "user",
            createdAt: new Date(),
        };

        const result = await users.insertOne(newUser);

        return NextResponse.json(
            {
                success: true,
                message: "Registration successful",
                userId: result.insertedId,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 }
        );
    }
}