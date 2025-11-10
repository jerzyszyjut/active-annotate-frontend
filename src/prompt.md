I want you to prepare a frontend application for a backend machine learning active learning loop

In this repo you have an empty HeroUI app. Delete pages and components that exists here as you will expand this project. You should install
new HeroUI components that would help you. Use ky for requests.

You also have access to backend written in django which OpenAPI schema is in `api.yaml` file but not everything is schemad correctly so
look at view, serializer and models too

Now, going back to frontend app that I want. It should have views below:

- Dashboard view with a list of datasets
- Dataset view with list of datapoints, labels and dataset info (with secret hashed out). Dataset info should be editable. And there should
  be a button "Start active" learning
- Datapoint view (best done in modal or appearing to side when clicking on datapoints in dataset view) with a list
  of predictions grouped by their version and a label

If you see some other features as a good practices or clear improvements, you may implement them too.
