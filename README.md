# leader-js

Leader tab selection without delays using localStorage

```js
    if (zero.leader.isLeader()){
        // we're on last active tab, do alerts /
        // messaging / calls / play notify sound etc here only
    }
```

```js
    zero.leader.onChange(function(leader){
        console.log('New leader', leader);
    });
```

## Depends on

* https://github.com/olamedia/zero-js
* window.localStorage http://caniuse.com/#feat=namevalue-storage 93.96% global (IE 8+)
* window.JSON http://caniuse.com/#feat=json 96.79% global (IE 8+)

## License
MIT
