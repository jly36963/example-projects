package jutsu

import (
	"chi-squirrel-example/api/utils"
	"chi-squirrel-example/providers"
	"chi-squirrel-example/types"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func RegisterJutsu(app chi.Router, providers *providers.Providers) {
	app.Route("/api/jutsu", func(r chi.Router) {
		// Get jutsu
		r.Get("/{id}/", func(w http.ResponseWriter, r *http.Request) {
			id := chi.URLParam(r, "id")
			jutsu, err := providers.PGDAL.GetJutsu(id)
			if err != nil {
				utils.SendStatus(w, http.StatusInternalServerError)
				return
			}
			utils.SendJSON(w, http.StatusOK, jutsu)
		})

		// Insert jutsu
		r.Post("/", func(w http.ResponseWriter, r *http.Request) {
			var jutsuNew types.JutsuNew
			err := utils.ReadJSON(r, &jutsuNew)
			if err != nil {
				utils.SendStatus(w, http.StatusBadRequest)
				return
			}
			jutsu, err := providers.PGDAL.CreateJutsu(jutsuNew)
			if err != nil {
				utils.SendStatus(w, http.StatusInternalServerError)
				return
			}
			utils.SendJSON(w, http.StatusOK, jutsu)
		})

		// Update jutsu
		r.Put("/{id}/", func(w http.ResponseWriter, r *http.Request) {
			id := chi.URLParam(r, "id")
			var jutsuUpdates types.JutsuNew
			err := utils.ReadJSON(r, &jutsuUpdates)
			if err != nil {
				utils.SendStatus(w, http.StatusBadRequest)
				return
			}
			jutsu, err := providers.PGDAL.UpdateJutsu(id, jutsuUpdates)
			if err != nil {
				utils.SendStatus(w, http.StatusInternalServerError)
				return
			}
			utils.SendJSON(w, http.StatusOK, jutsu)
		})

		// Delete Jutsu
		r.Delete("/{id}/", func(w http.ResponseWriter, r *http.Request) {
			id := chi.URLParam(r, "id")
			jutsu, err := providers.PGDAL.DeleteJutsu(id)
			if err != nil {
				utils.SendStatus(w, http.StatusInternalServerError)
				return
			}
			utils.SendJSON(w, http.StatusOK, jutsu)
		})
	})
}
