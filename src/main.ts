import type { Actress } from "./types/globalTypes";

const urlActress:string ='http://localhost:3333/actresses';

const validNationalities = [
  "American",
  "British",
  "Australian",
  "Israeli-American",
  "South African",
  "French",
  "Indian",
  "Israeli",
  "Spanish",
  "South Korean",
  "Chinese",
] as const;

function isActress(obj: unknown): obj is Actress {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const a = obj as Record<string, unknown>;

  return (
    typeof a.id === "number" &&
    typeof a.name === "string" &&
    typeof a.birth_year === "number" &&
    (typeof a.death_year === "number" || a.death_year === undefined) &&
    typeof a.biography === "string" &&
    typeof a.image === "string" &&

    Array.isArray(a.most_famous_movies) &&
    a.most_famous_movies.length === 3 &&
    a.most_famous_movies.every(m => typeof m === "string") &&

    typeof a.awards === "string" &&

    typeof a.nationality === "string" &&
    validNationalities.includes(a.nationality as typeof validNationalities[number])
  );
}

async function getActress(id:number): Promise<Actress | null>{
  try{
    const res = await fetch(`${urlActress}/${id}`)
    if (!res.ok) {
      return null;
    }
    const data = await res.json();

    if (isActress(data)) {
      return data;
    }

    return null;
  }
  catch (err){
    console.error(err)
    return null;
  }
}

async function getAllActresses():Promise <Actress[]> {
  try{
    const res = await fetch(`${urlActress}`)
    if (!res.ok) {
      return []
    }

    const data:unknown = await res.json();
    if (!Array.isArray(data)) {
      return []
    }

    const actresses: Actress[] = data.filter(obj => isActress(obj));
    return actresses;
  }
  catch(err){
    console.error(err)
    return [];
  }

}

async function getActresses(actressesIsds:number[]): Promise  <(Actress | null)[]> {
  try{
    const promises = await actressesIsds.map(id => getActress(id));
    return await Promise.all(promises);
  }
  catch(err){
    console.error(err);
    return []
  }
}

getActress(40).then(actress => console.log(actress))
getAllActresses().then(actresses => console.log(actresses))
getActresses([0,2,3,4,5]).then(actresses => console.log(actresses))