import * as SQLite from 'expo-sqlite';


type Item = {
    id: string;
    type: "enum" | "number" | "boolean";
};

export async function getEntrys({
    kategory,
    items
}: {
    kategory: string,
    items: Item[]
}) {
    const db = await SQLite.openDatabaseAsync('1MD', {
        useNewConnection: true
    });

    let columnNames = items.map(item => item.id).join(", ");
    if (columnNames.length === 0) {
        throw new Error("No items provided");
    }

    const res = await db.getAllAsync(`SELECT ${columnNames}, date FROM ${kategory}`);

    // Wandelt alle "true"/"false"-Strings in Boolean-Werte um
    const mappedRes = res.map(row =>
    Object.fromEntries(
        Object.entries(row).map(([key, value]) => {
        if (value === "true") return [key, true];
        if (value === "false") return [key, false];
        return [key, value];
        })
    )
    );

    console.log("Query Result:", mappedRes);
    return mappedRes;
}