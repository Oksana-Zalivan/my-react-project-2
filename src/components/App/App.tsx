import { useState } from "react";
import axios from "axios";
import OrderForm from "../OrderForm/OrderForm";
import SearchForm from "../SearchForm/SearchForm";

interface Article {
  objectID: string;
  title: string;
  url: string;
}

interface ArticlesHttpResponse {
  hits: Article[];
}

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);

  const handleSubmit = (data: string) => {
    console.log("Order received from:", data);
  };
  const handleSearch = async (topic: string) => {
    const response = await axios.get<ArticlesHttpResponse>(
      `https://hn.algolia.com/api/vl/search?query=${topic}`
    );
    setArticles(response.data.hits);
  };

  return (
    <>
      <h1>Place your order</h1>
      <OrderForm onSubmit={handleSubmit} />

      <SearchForm onSubmit={handleSearch} />
    </>
  );
}
