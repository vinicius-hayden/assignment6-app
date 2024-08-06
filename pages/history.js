
import { useRouter } from "next/router";
import { ListGroup, Button, Card, Container } from "react-bootstrap";
import styles from '@/styles/History.module.css';
import { useAtom } from "jotai";
import { searchHistoryAtom } from "../store";
import { removeFromHistory } from "@/lib/userData";

export default function SearchHistory() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const parsedHistory = searchHistory.map((history) => {
    const params = new URLSearchParams(history);
    return Object.fromEntries(params.entries());
  });
  
  const router = useRouter();

  if(!searchHistory) return null;

  const historyClicked = (e, index) => {
    router.push(`/artwork?${searchHistory[index]}`);
  };

  async function removeHistoryClicked(e, index){
    e.stopPropagation(); 
    setSearchHistory(await removeFromHistory(searchHistory[index])) 
  };

  return (
    <>
      {parsedHistory.length === 0 ? (
        <Card style={{ marginTop: "5rem" }}>
          <Card.Body>
            <Card.Title style={{ fontSize: "1.5rem", fontWeight: "600" }}>
              No Search History
            </Card.Title>
            <Card.Text style={{ fontSize: "1.2rem" }}>
              Start searching for some artwork to see your history here.
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <ListGroup style={{ marginTop: "4.5rem" }}>
          {parsedHistory.map((historyItem, index) => (
            <ListGroup.Item
              key={index}
              className={styles.historyListItem}
              onClick={(e) => handleHistoryClick(e, index)}
            >
              {Object.keys(historyItem).map((key) => (
                <span key={key}>
                  {key}: <strong>{historyItem[key]}</strong>&nbsp;
                </span>
              ))}
              <Button
                variant="danger"
                size="sm"
                className="float-end"
                onClick={(e) => handleRemoveHistoryClick(e, index)}
              >
                &times;
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
    
}
