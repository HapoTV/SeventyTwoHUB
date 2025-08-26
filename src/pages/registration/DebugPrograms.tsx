// src/pages/registration/DebugPrograms.tsx
import React, { useEffect } from "react";
import { supabase } from "../../lib/supabase";

const DebugPrograms: React.FC = () => {
    useEffect(() => {
        const runDiagnostics = async () => {
            console.log("🔍 Running Supabase diagnostics...");

            // 1. Fetch all rows (no filters)
            const { data: allPrograms, error: allError } = await supabase
                .from("programs")
                .select("*");

            console.log("➡️ Raw programs response:", allPrograms);
            if (allError) {
                console.error("❌ Error fetching programs:", allError);
                return;
            }

            if (!allPrograms || allPrograms.length === 0) {
                console.warn("⚠️ No rows returned. Could be RLS blocking access.");
                return;
            }

            // 2. Check distinct status values
            const statuses = Array.from(new Set(allPrograms.map((p) => p.status)));
            console.log("🟢 Distinct status values in DB:", statuses);

            // 3. Try the filtered query
            const { data: activePrograms, error: activeError } = await supabase
                .from("programs")
                .select("*")
                .eq("status", "active");

            console.log("✅ Active programs (status='active'):", activePrograms);
            if (activeError) {
                console.error("❌ Error fetching active programs:", activeError);
            }

            // 4. Show a quick summary
            console.log(`📊 Summary:
        Total rows: ${allPrograms.length}
        Active rows: ${activePrograms?.length || 0}
        Status values: ${statuses.join(", ")}
      `);
        };

        runDiagnostics().catch((err) =>
            console.error("Unexpected error in diagnostics:", err)
        );
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold">Supabase Debug Panel</h1>
            <p className="text-gray-600">
                Check the browser console (F12) for full diagnostics output.
            </p>
        </div>
    );
};

export default DebugPrograms;
