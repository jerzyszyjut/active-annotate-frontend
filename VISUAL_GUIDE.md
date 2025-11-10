# Visual Guide: New Features

## Dashboard Page - Create Dataset

```
┌─────────────────────────────────────────────────────┐
│  Datasets                    [+ Create Dataset]     │
│  Manage your classification datasets                │
│  [Search box]                                       │
├─────────────────────────────────────────────────────┤
│  Name         Datapoints  Labels  Batch Size  Act.. │
├─────────────────────────────────────────────────────┤
│  Dataset A         100       5       16       [View]│
│  Dataset B          50       3       32       [View]│
└─────────────────────────────────────────────────────┘
```

### Create Dataset Modal

```
┌──────────────────────────────────────┐
│  Create New Dataset             [✕]  │
├──────────────────────────────────────┤
│                                      │
│  Dataset Name: [________________]    │
│                                      │
│  Label Studio URL: [______________]  │
│                                      │
│  Label Studio API Key: [***** ] ●    │
│                                      │
│  ML Backend URL: [________________]   │
│                                      │
│  Batch Size: [16            ]        │
│                                      │
│         [Cancel]  [Create Dataset]   │
└──────────────────────────────────────┘
```

---

## Dataset Page - Enhanced Features

### Label Management

```
┌─────────────────────────────────────┐
│  [Start Active Learning] [+ Manage   │
│   [disabled]             Labels]    │
└─────────────────────────────────────┘
```

### Label Management Modal

```
┌──────────────────────────────┐
│  Manage Labels          [✕]  │
├──────────────────────────────┤
│  Add New Label               │
│  Class Index: [0  ]  Add     │
│  Class Label: [Cat ] [+]     │
│                              │
│  Current Labels              │
│  ┌──────────────────────────┐│
│  │ Cat      (Index: 0)      ││
│  └──────────────────────────┘│
│  ┌──────────────────────────┐│
│  │ Dog      (Index: 1)      ││
│  └──────────────────────────┘│
│                              │
│          [Close]             │
└──────────────────────────────┘
```

---

### Datapoint Filtering UI

```
┌──────────────────────────────────────────────────────────┐
│  Datapoints                                              │
│  Filter Datapoints                                       │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │All      │ │Min Conf: │ │Max Conf: │ │Model Ver:   │ │
│  │Labeled  │ │[    ]    │ │[    ]    │ │[    ]       │ │
│  │Unlabeled│ │         │ │         │ │            │ │
│  └─────────┘ └──────────┘ └──────────┘ └──────────────┘ │
│  Showing 45 of 100 datapoints                            │
└──────────────────────────────────────────────────────────┘
```

### Datapoint List with Actions

```
┌────────────────────────────────────────────┐
│  Datapoint #1                  [Labeled ✓] │
│  5 predictions                       [+Pred]│
├────────────────────────────────────────────┤
│  Datapoint #2                [Unlabeled  ] │
│  3 predictions                       [+Pred]│
├────────────────────────────────────────────┤
│  Datapoint #3                  [Labeled ✓] │
│  7 predictions                       [+Pred]│
└────────────────────────────────────────────┘
```

### Prediction Creation Modal

```
┌────────────────────────────────┐
│  Add Prediction            [✕] │
├────────────────────────────────┤
│                                │
│  Predicted Label ID: [1     ]  │
│  Available labels: 1 (Cat),    │
│  2 (Dog), 3 (Bird)             │
│                                │
│  Confidence (0-1): [0.85   ]   │
│                                │
│  Model Version: [1         ]   │
│                                │
│    [Cancel]  [Add Prediction]  │
└────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────┐
│   Dashboard Page    │
│                     │
│  [+ Create Dataset] │
│   Opens Modal ──┐   │
└─────────────────┼───┘
                  │
                  ▼
         ┌────────────────┐
         │ Create Dataset │
         │ Modal Form     │
         └────────┬───────┘
                  │ Submit
                  ▼
         POST /api/data/datasets/
                  │
                  ▼
         Dataset Created ✓
         Refresh List
                  │
                  ▼
    ┌──────────────────────────┐
    │   Dataset Detail Page    │
    │                          │
    │ [Start Active Learning]  │
    │ [+ Manage Labels]  ◄─────┤─── Labels Management
    │                          │
    │ Filter Datapoints        │
    │ ├─ Label Status ◄───────┤─── Filter UI
    │ ├─ Min Confidence       │
    │ ├─ Max Confidence       │
    │ └─ Model Version        │
    │                          │
    │ Datapoint #1  [+Pred] ◄─┤─── Add Prediction
    │ Datapoint #2  [+Pred]  │
    │ Datapoint #3  [+Pred]  │
    └──────────────────────────┘
           │
           ├──► POST /api/data/labels/ (Add Label)
           ├──► POST /api/data/predictions/ (Add Prediction)
           └──► GET /api/data/datasets/{id}/ (Refresh)
```

---

## Feature Usage Timeline

### 1️⃣ Create Dataset (Dashboard)

```
User clicks "+ Create Dataset"
    ↓
Modal opens with form
    ↓
User fills all fields
    ↓
User clicks "Create Dataset"
    ↓
POST request sent
    ↓
Success: Dataset added to list
    ↓
User clicks "View"
    ↓
Dataset page opens
```

### 2️⃣ Add Labels (Dataset)

```
User clicks "+ Manage Labels"
    ↓
Modal opens
    ↓
User enters Class Index & Label
    ↓
User clicks "Add"
    ↓
POST request sent
    ↓
Success: Label added to list
    ↓
Dataset page refreshes with new labels
```

### 3️⃣ Add Predictions (Dataset)

```
User finds datapoint
    ↓
User clicks "+Pred"
    ↓
Modal opens with empty form
    ↓
User fills prediction details
    ↓
User clicks "Add Prediction"
    ↓
POST request sent
    ↓
Success: Prediction added
    ↓
Dataset page refreshes
    ↓
Datapoint shows updated prediction count
```

### 4️⃣ Filter Datapoints (Dataset)

```
User adjusts filter dropdowns/inputs
    ↓
Real-time filtering applied
    ↓
Datapoint list updates
    ↓
Count shows: "Showing X of Y"
    ↓
User combines multiple filters
    ↓
List updates with all filters applied
    ↓
User clicks on datapoint
    ↓
Modal shows predictions
```

---

## Filter Logic Examples

### Example 1: Show Unlabeled Datapoints

```
Filter: Label Status = "Unlabeled Only"
Result: Only datapoints with label = null shown
Count: "Showing 25 of 100 datapoints"
```

### Example 2: Show High-Confidence Predictions

```
Filter: Min Confidence = 0.8
Result: Only datapoints with at least one prediction >= 0.8
Count: "Showing 60 of 100 datapoints"
```

### Example 3: Compare Model Versions

```
Filter: Model Version = 2
Result: Only datapoints with predictions from model v2
Count: "Showing 50 of 100 datapoints"
```

### Example 4: Find Uncertain Predictions

```
Filter: Min Confidence = 0.3
Filter: Max Confidence = 0.7
Result: Datapoints with predictions in 0.3-0.7 range
Count: "Showing 30 of 100 datapoints"
```

### Example 5: Combined Filters

```
Filter: Label Status = "Labeled"
Filter: Min Confidence = 0.5
Filter: Model Version = 3
Result: Labeled datapoints with v3 predictions >= 0.5
Count: "Showing 15 of 100 datapoints"
```

---

## Component Hierarchy

```
App
├── Dashboard Page
│   ├── CreateDatasetModal (NEW)
│   │   └── Form Inputs
│   └── Dataset Table
│
└── Dataset Page
    ├── Dataset Info Card (UPDATED)
    │   └── Edit Form
    ├── Statistics Cards
    ├── Action Buttons (UPDATED)
    │   ├── Start Active Learning
    │   └── Manage Labels Button
    ├── Filter Section (NEW)
    │   ├── Label Status Dropdown
    │   ├── Min Confidence Input
    │   ├── Max Confidence Input
    │   └── Model Version Input
    ├── Datapoints List (UPDATED)
    │   ├── Datapoint Item (UPDATED)
    │   │   ├── Click to view
    │   │   ├── Label Badge
    │   │   └── +Pred Button (NEW)
    │   └── No results message
    ├── DatapointModal (EXISTING)
    ├── LabelManagementModal (NEW)
    ├── CreatePredictionModal (NEW)
    └── Refresh Handlers
```

---

## State Management

### Dashboard Page State

```
const [datasets, setDatasets] = useState([])
const [searchTerm, setSearchTerm] = useState("")
const [error, setError] = useState(null)
const { isOpen, onOpen, onClose } = useDisclosure() // Modal
```

### Dataset Page State

```
const [dataset, setDataset] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
const [isEditingInfo, setIsEditingInfo] = useState(false)
const [editedDataset, setEditedDataset] = useState({})

// NEW: Filters
const [filterByLabel, setFilterByLabel] = useState("all")
const [filterByMinConfidence, setFilterByMinConfidence] = useState("")
const [filterByMaxConfidence, setFilterByMaxConfidence] = useState("")
const [filterByModelVersion, setFilterByModelVersion] = useState("")

// NEW: Modals
const { isOpen, onOpen, onClose } = useDisclosure()
const { isOpen: isLabelModalOpen, onOpen: onLabelModalOpen, onClose: onLabelModalClose } = useDisclosure()
const { isOpen: isPredictionModalOpen, onOpen: onPredictionModalOpen, onClose: onPredictionModalClose } = useDisclosure()
```

---

## API Contract

### Types

```typescript
// User Input (Create Dataset)
{
  name: string
  label_studio_url: string
  label_studio_api_key: string
  ml_backend_url: string
  batch_size: number
}

// User Input (Create Label)
{
  dataset: number
  class_index: number
  class_label: string
}

// User Input (Create Prediction)
{
  datapoint: number
  predicted_label: number (label ID)
  confidence: number | null
  model_version: number
}

// Filter State
{
  filterByLabel: "all" | "labeled" | "unlabeled"
  filterByMinConfidence: string (empty or "0.0" to "1.0")
  filterByMaxConfidence: string (empty or "0.0" to "1.0")
  filterByModelVersion: string (empty or number)
}
```

---

**Last Updated**: November 10, 2025
