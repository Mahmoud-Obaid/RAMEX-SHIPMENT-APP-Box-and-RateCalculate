
# Aramex Shipment Rate Calculator

A zero-dependency web tool that calculates the best way to pack a multi-item shipment and retrieves live shipping rates from Aramex's `CalculateRate` API using the resulting dimensions and weight.

> **Disclaimer:** This is an independent project and is not affiliated with or endorsed by Aramex. You need your own Aramex API credentials to use this tool.

---

## Features

* **Smart Packing:** Enter up to 30 items (length, width, height, weight). The app searches multiple layouts and returns the overall shipment dimensions and total weight across three packing modes:
  1. **Best Arrangement (No box):** Uses the raw arrangement dimensions.
  2. **Predefined Box:** Fits the arrangement into the smallest box from your custom box list.
  3. **Auto-generated Box:** Rounds each dimension up to the next multiple of 5 cm.
* **Keep Box Directions:** Keeps each item's height vertical, ensuring items are only turned around the vertical axis and never tipped on their side.
* **Arrange in Vertical Layers:** Looks for the layout closest to a cube with the least wasted space. Largest items form the base, smaller items sit fully supported on top, and multiple items can share a layer.
* **Extra Dimensions / Extra Weight Toggles:** Add padding or packaging weight on top of the calculated results before requesting a rate.
* **Box Manager:** Add, edit, or delete predefined boxes (Class, ID, dimensions, tare weight). Each box code follows the format `Class-ID`.
* **Built-in Location Data:** Bundles 246 countries with their respective cities and states, meaning address dropdowns require zero API calls.
* **Rate Calculation:** Automatically sets the Product Group (`DOM`/`EXP`). Choose your Product Type, Payment Type (Shipper, Consignee, Third Party), and currency.

---

## How It Works

```text
Items  ->  Best arrangement  ->  (optional) box  ->  + extras  ->  CalculateRate
