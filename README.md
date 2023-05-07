# BO-FRONT new
## Validations de formulaire nouveau Front

Le nouveau système de validation des formulaires se base sur la librairie JS [Vuelidate](https://vuelidate.js.org/#getting-started).


### Côté Script

Dans un composant contenant le formulaire à valider, il faut importer une mixin créée pour centraliser le fonctionnement des règles de validations, et l'utiliser.

```js
import { validationMixin } from '@/mixins'

export default Vue.extend({
  name: 'my-component',
  mixins: [validationMixin],
})
```

Le composant a ensuite besoin d'un objet `validations` qui va réunir toutes les règles sur les différents champs.

> Cet objet doit absolument suivre la même architecture que l'objet ou les propriétés servant à alimenter les champs.

Exemple pour un formulaire avec `firstname` et `lastname` dans un objet `form`. Dans cet exemple l'objet se trouve dans les `data`:

```js
import { validationMixin } from '@/mixins'

export default Vue.extend({
  name: 'my-component',
  mixins: [validationMixin],
  data: {
    form: {
      firstname: '',
      lastname: '',
    },
  },
  validations: {
    form: {
      firstname: { required },
      lastname: { required }
    },
  },
})
```

> `validations` peut également être une méthode retournant un objet, ainsi cela facilite l'accès à certaines propriétés du composant si besoin grâce à `this`.

Dans l'exemple ci-dessus, les 2 champs sont obligatoires, ils utilisent un `validator`, fonction exposée par la librairie. Il faut donc importer tout ce dont on a besoin :

```js
import { required } from 'vuelidate/lib/validators'
```

> Il en existe beaucoup qui couvrent quasiment la totalité de notre besoin.
> Ils sont documentés [ici](https://vuelidate.js.org/#sub-builtin-validators).

> Attention cependant à ne pas utiliser le validateur `numeric` qui est un équivalent de `integer`.

### Côté Template

Les composants champs de formulaire du design system de Woop prennent désormais 2 nouvelles propriétés et ne reçoivent plus la propriété `rules`.

- `errors: string[]`: Contient les erreurs à afficher sous le champs lorsque celui-ci est invalide.
- `isDirty: boolean`: Détermine si le champs contient quelque chose ou a été modifié par l'utilisateur.

Ainsi sur les champs texte design system on obtient l'exemple suivant avec le prénom et le nom :

```html
<mp-textfield
  label="Prénom"
  v-model="form.firstname"
  @input="$v.form.firstname.$touch()"
  @blur="$v.form.firstname.$touch()"
  :errors="getModelErrors($v.form.firstname)"
  :isDirty="$v.form.firstname.$dirty"
/>
​
<mp-textfield
  label="Nom"
  v-model="form.lastname"
  @input="$v.form.lastname.$touch()"
  @blur="$v.form.lastname.$touch()"
  :errors="getModelErrors($v.form.lastname)"
  :isDirty="$v.form.lastname.$dirty"
/>
```

> `getModelErrors` est une méthode exposée par notre mixin custom, elle se charge de récupérer pour chaque validator de Vuelidate, un message d'erreur associé. Si besoin vous pouvez l'alimenter dans `/src/mixins/validationMixin`.

> `$touch()` est une fonction qui permet de mettre à jour la propriété `isDirty` du champ en question. D'où la nécessité de la déclencher aux events `input` et `blur`.

### Invalidité du formulaire

Si vous avez un bouton de validation dépendant de la validité du formulaire, vous pouvez utiliser la propriété `$invalid`, qui contient un booléen déterminant l'invalidité d'un champ ou plusieurs champs.

Il y a donc plusieurs manières de l'utiliser, toujours sur l'exemple du prénom : 

 - `$v.form.firstname.$invalid`: Désigne l'invalidité du champ prénom.
 - `$v.form.$invalid`: Désigne un aggrégat de toutes les invalidités des champs enfants à l'objet `form`.
 - `$v.$invalid`: Désigne alors l'invalidité de tous les champs contenus dans l'objet `validations`.

 ```html
  <mp-button
    format="success"
    :disabled="$v.form.$invalid"
    text="Valider"
  />
  ```


### Champs de formulaire dans un composant enfant

Si les champs de formulaire se trouvent dans un sous-composant, mais que votre bouton de validation est dans le parent, vous aurez besoin d'utiliser les évènements.

- **Côté parent**: Préparez un objet qui va réunir toutes les invalidités des composants enfants.
  ```js
  export default Vue.extend({
    name: 'my-component-wrapper',
    data: {
      invalids: {
        firstname: false,
        lastname: false
      }
    },
  })
  ```
  Et écoutez l'évènement `invalid` sur les componants enfants
  ```html
  <firstname @invalid="invalids.firstname = $event" />
  <lastname @invalid="invalids.lastname = $event" />

  <mp-button
    format="success"
    :disabled="invalids.firstname || invalids.lastname"
    text="Valider"
  />
  ```
- **Côté enfant**: Il faudra émettre l'invalidité des champs lorsque le composant est monté (utile pour les modes édition) ainsi qu'à chaque changement d'invalidité d'un champ.
  ```js
  export default Vue.extend({
    name: 'my-component',
    mixins: [validationMixin]
    data: {
      form: {
        firstname: '',
        lastname: '',
      },
    },
    validations: {
      form: {
        firstname: { required },
        lastname: { required }
      },
    }
    mounted() {
      this.$emit('invalid', this.$v.form.$invalid)
    },
    watch: {
      '$v.form.$invalid'(next, current) {
        this.$emit('invalid', next)
      }
    },
  })
  ```

## Notes

### Linter

On your VScode, install Vetur, TSlint and Prettier extensions then add this configuration into your VScode `settings.json`.

```json
"vetur.validation.template": true,
"editor.formatOnSave": true,
"editor.codeActionsOnSave": {
    "source.fixAll.tslint": true
}
```

### Router

To enable Vue router's history mode in production, this server configuration sample is needed.

Nginx:

```
location / {
  root /app;
    try_files $uri $uri/ @rewrites;
  }

  location @rewrites {
    rewrite ^(.+)$ /index.html last;
  }
}

```

### Internationalization

To avoid `i18next` warning at TypeScript compilation, we'll have to wait for this [PR](https://github.com/panter/vue-i18next/pull/89) to be merged in `@panter/vue-i18next`.

For the moment a patch has been applied locally, placed in folder `patches`.
