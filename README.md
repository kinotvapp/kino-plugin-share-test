# kino-plugin-share-test

Two throwaway Kino plugins used only to check share cards (`go.plugin`, `openFrom`, `kino.image.thumbnail`) on a device.
Not listed in Kino's community catalog. Install in Kino ▸ Plugins ▸ + with `kinotvapp/kino-plugin-share-test/target` and
`kinotvapp/kino-plugin-share-test/opener`.

Opener 1.1.0 adds «6. Compartir tarjeta» and «7. Publicar ya» (Kino Social's `wall.card`, the second with `publish: true`)
and accepts the route `item` from outside (`openFrom`), so a card it shares opens it at «item 42».
