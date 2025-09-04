import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import dayjs from "dayjs";
import { logEvent } from "../utils/logger";

function StatisticsPage() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem("links")) || [];
    setLinks(stored);
    logEvent("Statistics viewed", { totalLinks: stored.length });
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        URL Statistics
      </Typography>

      {links.length === 0 ? (
        <Typography>No URLs shortened yet.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Total Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {links.map((l, i) => (
              <TableRow key={i}>
                <TableCell>
                  <a href={`/${l.code}`}>http://localhost:3000/{l.code}</a>
                </TableCell>
                <TableCell>{l.url}</TableCell>
                <TableCell>{dayjs(l.created).format("YYYY-MM-DD HH:mm")}</TableCell>
                <TableCell>{dayjs(l.expire).format("YYYY-MM-DD HH:mm")}</TableCell>
                <TableCell>{l.clicks.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}

export default StatisticsPage;
