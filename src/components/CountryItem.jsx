import ReactCountryFlag from "react-country-flag";
import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
                <ReactCountryFlag
                  countryCode={country.emoji}
                  svg
                  style={{
                    width: "2em",
                    height: "2em",
                  }}
                  title={country.country}
                />
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
