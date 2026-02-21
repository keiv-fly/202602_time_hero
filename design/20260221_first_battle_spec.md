# The first battle

Hero has:
- 10 hp
- equipped with knife (2 attack and 10 durability)
- if the knife brakes then use hands (1 attack and infinite durability)
- occupies two 2x2 squares
- can move 8 squares at a time
- this means 8 AP
- attack with a knife or hands spends 50% of AP (4 in this case)

One rat has:
- 2 hp
- 2 damage from attack
- occupies 1x1 squares
- can move 8 squares at a time
- this means 8 AP
- attack spends 50% of movement points (4 in this case)

Damage means that one attack will remove the damage number from hp

The action points spent are calculated by Euclidean distance = ceil(sqrt(x^2+y^2))

The following map:

     #E#
     #3#
     # #
     # #
     # #
###### #
#    2 #
#1######
# #
# #
# #
#H#
###

The map is drawn so that one element is in reality 4x4 element.
For example:
Hero start is in reality:
#    #
# H  #
#    #
#    #
######

First rat encounter is:

#    #
# R  #
#    #
#    #

First turn of the corridor:
#######
#
#
#
#
#    ##
#    #

Where:
- # are walls.
- spaces are empty space that could be traversed
- H is the starting point for the hero
- E is exit area 4x4
- 1 is the first encounter with one rat in the center
- 2 is the second encounter with two rats in the center
- 3 is the third encounter with 10 rats in the following pattern:

# RR #
#RRRR#
#RRRR#
#    #

