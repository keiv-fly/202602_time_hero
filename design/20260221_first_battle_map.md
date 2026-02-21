# First Battle Full Map

This is the expanded map for the first battle based on `20260221_first_battle_spec.md`.

Each symbol from the compact map is expanded to a 4x4 traversable area, with `#` as walls.

## Legend

- `#` = wall
- space = traversable tile
- `H` = hero start
- `R` = specific rat position
- `E` = exit area tile (full 4x4 block)

## Full Expanded Layout (4x4 Resolution)

```text
                    ######
                    #EEEE#
                    #EEEE#
                    #EEEE#
                    #EEEE#
                    # RR #
                    #RRRR#
                    #RRRR#
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
#####################    #
#                        #
#                 RR     #
#                        #
#                        #
#    #####################
# R  #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
# H  #
#    #
#    #
######
```

## Rat Encounter Patterns (Applied on Main Map)

### Encounter 1 area - one rat centered

```text
#    #
# R  #
#    #
#    #
```

### Encounter 2 area - two rats centered

```text
#    #
# RR #
#    #
#    #
```

### Encounter 3 area - ten rats pattern

```text
# RR #
#RRRR#
#RRRR#
#    #
```

## Progression Path

`H -> encounter 1 -> encounter 2 -> encounter 3 -> E`

