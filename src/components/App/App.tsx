import { useEffect, useState } from "react";
import axios from "axios";
import OrderForm from "../OrderForm/OrderForm";
import SearchForm from "../SearchForm/SearchForm";
import { Article } from "../../types/article";
import ArticleList from "../ArticleList/ArticleList";
import { fetchArticles } from "../../services/articleService";
import Timer from "../Timer/Timer";
import Modal from "../Modal/Modal";

interface Character {
  name: string;
  height: number;
}

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [person, setPerson] = useState<Character | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(1);
  const [isCharLoading, setIsCharLoading] = useState(false);
  const [isCharError, setIsCharError] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clicks, setClicks] = useState(() => {
    const savedClicks = window.localStorage.getItem("saved-clicks");
    return savedClicks !== null ? JSON.parse(savedClicks) : 0;
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    async function fetchCharacter() {
      try {
        setIsCharLoading(true);
        setIsCharError(false);

        const response = await axios.get(
          `https://swapi.info/api/people/${count}`
        );

        setPerson(response.data);
      } catch {
        setIsCharError(true);
      } finally {
        setIsCharLoading(false);
      }
    }

    fetchCharacter();
  }, [count]);

  const handleSubmit = (data: string) => {
    console.log("Order received from:", data);
  };

  const handleSearch = async (topic: string) => {
    try {
      const data = await fetchArticles(topic);
      setArticles(data);
    } catch {
      console.log("Search error");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
      console.log(`Interval - ${Date.now()}`);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("saved-clicks", JSON.stringify(clicks));
  }, [clicks]);

  return (
    <>
      <h1>Place your order</h1>
      <OrderForm onSubmit={handleSubmit} />

      <SearchForm onSubmit={handleSearch} />

      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Hide timer" : "Show timer"}
      </button>

      <button onClick={() => setCount(count + 1)}>Count is {count}</button>

      {isOpen && <Timer />}

      <p>TimerBox - {time.toLocaleTimeString()}</p>

      {isCharLoading && <p>Loading data, please wait...</p>}
      {isCharError && <p>Woops, something went wrong! Please try again!</p>}
      {articles.length > 0 && <ArticleList items={articles} />}

      <h2>The count is {count}</h2>
      <button onClick={() => setCount(count + 1)}>Get next character</button>
      <pre>{JSON.stringify(person, null, 2)}</pre>

      <div>
        <h1>Main content of the page</h1>
        <button onClick={openModal}>Open modal</button>
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <h2>Custom Modal Content</h2>
            <p>This is a reusable modal with dynamic content.</p>
          </Modal>
        )}
      </div>

      <div>
        <button onClick={() => setClicks(clicks + 1)}>
          You clicked {clicks} times
        </button>
        <button onClick={() => setClicks(0)}>Reset</button>
      </div>
    </>
  );
}

