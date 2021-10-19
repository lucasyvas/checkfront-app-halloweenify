import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

type RequestConfig = {
  token: string;
  tokenType: string;
  company: string;
};

type Category = {
  id: number;
  name: string;
  description: string;
  weight: number;
  imageUrl: string;
  status: "enabled" | "hidden" | "archived";
  itemCount: number;
};

type CategoryPatch = Pick<Category, "id"> & Partial<Omit<Category, "id">>;

const HALLOWEEN_CANDIES = [
  "Jawbreakers",
  "Tootsie Rolls",
  "Skittles",
  "Mars",
  "Reeses",
  "Taffies",
  "Lollipops",
  "Marshmallows",
  "Smarties",
  "Snickers",
  "Oh Henrys",
  "Glosettes",
  "Jolly Ranchers",
  "Tootsie Pops",
  "Candy Corn",
  "Butterfingers",
  "Hershey's",
  "M&Ms",
  "Starburst",
  "Kit Kat",
  "Twix",
  "Sour Patch Kids",
  "Milky Ways",
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      return halloweenify(req, res);
    }

    default: {
      return res.status(404).end();
    }
  }
}

async function halloweenify(req: NextApiRequest, res: NextApiResponse) {
  const config: RequestConfig = req.body;

  if (!(config.token && config.tokenType && config.company)) {
    return res.status(400).end();
  }

  try {
    const categories = await getCategories(config);

    await patchCategories(
      categories.map(({ id }) => ({
        id,
        name: getRandomHalloweenCandy(),
      })),
      config
    );
  } catch (error) {
    console.error(error);
  }
}

async function getCategories({ token, tokenType, company }: RequestConfig) {
  const categoriesUrl = categoriesUrlFactory(company);

  try {
    const response = await fetch(categoriesUrl, {
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
    });

    if (!response.ok) {
      throw response;
    }

    return (await response.json()).data as Category[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function patchCategories(
  categories: CategoryPatch[],
  { token, tokenType, company }: RequestConfig
) {
  const categoriesUrl = categoriesUrlFactory(company);

  for (const { id, ...category } of categories) {
    try {
      const response = await fetch(`${categoriesUrl}/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `${tokenType} ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw response;
      }
    } catch (error) {
      console.error(error);
    }
  }
}

function categoriesUrlFactory(company: string) {
  return `${apiUrlFactory(company)}/categories`;
}

function apiUrlFactory(company: string) {
  return `https://${company}.checkfront.com/api/4.0`;
}

function getRandomHalloweenCandy() {
  return HALLOWEEN_CANDIES[
    Math.floor(Math.random() * HALLOWEEN_CANDIES.length)
  ];
}
