/* eslint-disable @typescript-eslint/no-explicit-any */
export const STANDARD_GRADE_ORDER = [
    "Preschool",
    "KG1",
    "KG2",
    "KG3",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
];

export const sortGrades = <T = any>(options: T[]): T[] => {
    const getGradeRank = (val: string): number => {
        const str = String(val || "").trim();
        const stdIndex = STANDARD_GRADE_ORDER.findIndex(
            (g) => g.toLowerCase() === str.toLowerCase()
        );
        if (stdIndex !== -1) return stdIndex;

        const match = str.match(/\d+/);
        if (match) {
            const num = parseInt(match[0], 10);
            if (str.toLowerCase().startsWith("kg")) return 10 + num;
            if (str.toLowerCase().startsWith("grade")) return 100 + num;
            return 500 + num;
        }
        return 1000;
    };

    return [...options].sort((a: any, b: any) => {
        const valA = a?.label || a?.value || a?.grade || "";
        const valB = b?.label || b?.value || b?.grade || "";
        const rankA = getGradeRank(valA);
        const rankB = getGradeRank(valB);
        if (rankA !== rankB) return rankA - rankB;
        return valA.localeCompare(valB, undefined, { numeric: true, sensitivity: "base" });
    });
};
