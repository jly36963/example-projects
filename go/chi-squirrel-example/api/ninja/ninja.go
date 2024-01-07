package ninja

import (
	"net/http"

	chi "github.com/go-chi/chi/v5"

	"chi-squirrel-example/api/utils"
	"chi-squirrel-example/providers"
	"chi-squirrel-example/types"
)

func RegisterNinja(app chi.Router, providers *providers.Providers) {
	app.Route("/api/ninja", func(r chi.Router) {
		// Get ninja
		r.Get("/{id}/", func(w http.ResponseWriter, r *http.Request) {
			id := chi.URLParam(r, "id")
			ninja, err := providers.PGDAL.GetNinja(id)
			if err != nil {
				utils.SendStatus(w, http.StatusInternalServerError)
				return
			}
			utils.SendJSON(w, http.StatusOK, ninja)
		})

		// Insert ninja
		r.Post("/", func(w http.ResponseWriter, r *http.Request) {
			var ninjaNew types.NinjaNew
			err := utils.ReadJSON(r, &ninjaNew)
			if err != nil {
				utils.SendStatus(w, http.StatusBadRequest)
				return
			}
			ninja, err := providers.PGDAL.CreateNinja(ninjaNew)
			if err != nil {
				utils.SendStatus(w, http.StatusInternalServerError)
				return
			}
			utils.SendJSON(w, http.StatusOK, ninja)
		})

		// Update ninja
		r.Put("/{id}/", func(w http.ResponseWriter, r *http.Request) {
			id := chi.URLParam(r, "id")
			var ninjaUpdates types.NinjaNew
			err := utils.ReadJSON(r, &ninjaUpdates)
			if err != nil {
				utils.SendStatus(w, http.StatusBadRequest)
				return
			}
			ninja, err := providers.PGDAL.UpdateNinja(id, ninjaUpdates)
			if err != nil {
				utils.SendStatus(w, http.StatusInternalServerError)
				return
			}
			utils.SendJSON(w, http.StatusOK, ninja)
		})

		// Delete Ninja
		r.Delete("/{id}/", func(w http.ResponseWriter, r *http.Request) {
			id := chi.URLParam(r, "id")
			ninja, err := providers.PGDAL.DeleteNinja(id)
			if err != nil {
				utils.SendStatus(w, http.StatusInternalServerError)
				return
			}
			utils.SendJSON(w, http.StatusOK, ninja)
		})

		// Get ninja with jutsus
		r.Get("/{id}/jutsus/", func(w http.ResponseWriter, r *http.Request) {
			id := chi.URLParam(r, "id")
			ninja, err := providers.PGDAL.GetNinjaWithJutsus(id)
			if err != nil {
				utils.SendStatus(w, http.StatusInternalServerError)
				return
			}
			utils.SendJSON(w, http.StatusOK, ninja)
		})
	})
}

func RegisterNinjaJutsu(app chi.Router, providers *providers.Providers) {
	app.Route("/api/ninja-jutsu/", func(r chi.Router) {
		// Associate ninja & jutsu
		r.Post("/{ninjaID}/{jutsuID}/", func(w http.ResponseWriter, r *http.Request) {
			ninjaID := chi.URLParam(r, "ninjaID")
			jutsuID := chi.URLParam(r, "jutsuID")
			err := providers.PGDAL.AssociateNinjaJutsu(ninjaID, jutsuID)
			if err != nil {
				utils.SendStatus(w, http.StatusInternalServerError)
				return
			}
			utils.SendStatus(w, http.StatusOK)
		})

		// Dissociate ninja & jutsu
		r.Delete("/{ninjaID}/{jutsuID}/", func(w http.ResponseWriter, r *http.Request) {
			ninjaID := chi.URLParam(r, "ninjaID")
			jutsuID := chi.URLParam(r, "jutsuID")
			err := providers.PGDAL.DissociateNinjaJutsu(ninjaID, jutsuID)
			if err != nil {
				utils.SendStatus(w, http.StatusInternalServerError)
				return
			}
			utils.SendStatus(w, http.StatusOK)
		})
	})
}
