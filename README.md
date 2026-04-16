# Election Forecast

A mobile-friendly web app for forecasting election results. Users can select winners and margins for each constituency, with customizable column visibility.

## Features

- View constituency data in a responsive table
- Select winner for each constituency (LDF, UDF, NDA)
- Input vote margin with range slider (0-75,000)
- Show/hide columns to customize view
- Export results to CSV
- Mobile-friendly design with tooltips for abbreviations

## Files

- `index.html` — main page with table
- `style.css` — responsive styling
- `app.js` — data and export logic

## Usage

### Run locally with FastAPI

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
3. Open the app in your browser:
   ```
   http://127.0.0.1:8000
   ```

### How to use the app

1. Open the app in your browser
2. Click "Show/Hide Columns" to toggle column visibility
3. For each constituency, select the winner and adjust the margin slider
4. Click "Export Results" for CSV download

## Data

Sample data includes districts, constituencies, candidates, voter statistics, and polling data.

## Abbreviations

- **LDF**: Left Democratic Front
- **UDF**: United Democratic Front
- **NDA**: National Democratic Alliance
