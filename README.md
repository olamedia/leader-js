# leader-js

Leader tab selection without delays using localStorage

```js
if (zero.leader && zero.leader.isLeader()){
    // we're on last active tab, do alerts /
    // messaging / calls / play notify sound etc here only
}
```

```js
if (zero.leader){
    zero.leader.onChange(function(leader){
        console.log('New leader', leader);
    });
}
```
Check support
```js
if (zero.leader){
}
```

## Depends on

* https://github.com/olamedia/olamedia-js (Namespace object)
* window.localStorage http://caniuse.com/#feat=namevalue-storage 93.96% global (IE 8+)
* window.JSON http://caniuse.com/#feat=json 96.79% global (IE 8+)

## License
MIT
