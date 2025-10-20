//

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import "react-datepicker/dist/react-datepicker.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Spinner from "./Spinner";
import ReactCountryFlag from "react-country-flag";
import Message from "./Message";
import DatePicker from "react-datepicker";
import { useCities } from "../contexts/CityContexts";
import { useNavigate} from "react-router-dom";

// export function convertToEmoji(countryCode) {
//   const codePoints = countryCode
//     .toUpperCase()
//     .split("")
//     .map((char) => 127397 + char.charCodeAt());
//   return String.fromCodePoint(...codePoints);
// }

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat, lng] = useUrlPosition();
  const { createCity, isLoading } = useCities();
      const navigate = useNavigate()


  const [isLoadingGeoLocation, setIsLoadingGeoLocation] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState("");

  useEffect(
    function () {
      if (!lat && !lng) return;
      async function fetchCityData() {
        try {
          setGeocodingError("");
          setIsLoadingGeoLocation(true);

          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );

          const data = await res.json();

          if (!data.countryCode) {
            throw new Error(
              "that dosn't seem to be a city. Click somewhere else 🤔"
            );
          }

          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(data.countryCode);
        } catch (err) {
          setGeocodingError(err.message);
        } finally {
          setIsLoadingGeoLocation(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );
  async function handleSubmit(e) {
    e.preventDefault();
    if (!date || !cityName) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    await createCity(newCity)
    navigate("/app/cities")
  }

  if (isLoadingGeoLocation) return <Spinner />;

  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map" />;

  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form className={`${styles.form} ${isLoading?styles.loading : ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor={cityName}>{cityName}</label>
        <input
          id={cityName}
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>
          {
            <ReactCountryFlag
              countryCode={emoji}
              svg
              style={{
                width: "1em",
                height: "1em",
                marginBottom: "5px",
              }}
              title={country}
            />
          }
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
