import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { logEvent } from "../utils/logger";
import dayjs from "dayjs";

function ShortenerPage() {
  const [inputs, setInputs] = useState([{ url: "", validity: "", code: "" }]);
  const [results, setResults] = useState([]);

  // Add new row (max 5)
  const addRow = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: "", validity: "", code: "" }]);
    }
  };

  // Handle input changes
  const handleChange = (index, field, value) => {
    const copy = [...inputs];
    copy[index][field] = value;
    setInputs(copy);
  };

  // Shorten URLs
  const shorten = () => {
    let newResults = [];
    let allLinks = JSON.parse(localStorage.getItem("links")) || [];

    for (let item of inputs) {
      if (!item.url.startsWith("http")) {
        alert("Invalid URL (must start with http)");
        logEvent("Invalid URL entered", { url: item.url });
        continue;
      }

      let code = item.code || Math.random().toString(36).substring(2, 7);
      if (allLinks.find((l) => l.code === code)) {
        alert("Code already used. Try another.");
        logEvent("Code collision", { code });
        continue;
      }

      let minutes = parseInt(item.validity) || 30;
      let expire = dayjs().add(minutes, "minute").toISOString();

      let newLink = {
        url: item.url,
        code,
        created: dayjs().toISOString(),
        expire,
        clicks: [],
      };

      allLinks.push(newLink);
      newResults.push(newLink);

      logEvent("URL shortened", { url: item.url, code });
    }

    localStorage.setItem("links", JSON.stringify(allLinks));
    setResults(newResults);
  };

  return (
    <Box p={3}>
      <Typography variant="h5">URL Shortener</Typography>

      {inputs.map((inp, i) => (
        <Box key={i} display="flex" gap={2} mt={2}>
          <TextField
            label="Long URL"
            value={inp.url}
            onChange={(e) => handleChange(i, "url", e.target.value)}
            fullWidth
          />
          <TextField
            label="Validity (mins)"
            value={inp.validity}
            onChange={(e) => handleChange(i, "validity", e.target.value)}
            type="number"
            style={{ width: "120px" }}
          />
          <TextField
            label="Custom Code"
            value={inp.code}
            onChange={(e) => handleChange(i, "code", e.target.value)}
            style={{ width: "120px" }}
          />
        </Box>
      ))}

      <Box mt={2}>
        <Button onClick={addRow} disabled={inputs.length >= 5}>
          + Add More
        </Button>
        <Button variant="contained" onClick={shorten} sx={{ ml: 2 }}>
          Shorten
        </Button>
      </Box>

      {results.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6">Results</Typography>
          {results.map((r, idx) => (
            <Typography key={idx}>
              Original: {r.url} → Short:{" "}
              <a href={`/${r.code}`}>http://localhost:3000/{r.code}</a> (Expires:{" "}
              {dayjs(r.expire).format("HH:mm:ss")})
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default ShortenerPage;
