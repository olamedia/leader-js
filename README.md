# leader-js

Leader tab selection without delays using localStorage

```js
if (olamedia.leader && olamedia.leader.isLeader()){
    // we're on last active tab, do alerts /
    // messaging / calls / play notify sound etc here only
}
```

```js
if (olamedia.leader){
    olamedia.leader.onChange(function(leader){
        console.log('New leader', leader);
    });
}
```
Check support
```js
if (olamedia.leader){
}
```

## Depends on

* https://github.com/olamedia/olamedia-js (Namespace object)
* window.localStorage http://caniuse.com/#feat=namevalue-storage 93.96% global (IE 8+)
* window.JSON http://caniuse.com/#feat=json 96.79% global (IE 8+)

## License
MIT
