#include <stdio.h>
#include <string.h>

int main() {
    char buffer[64];
    int hasFlag = 0;

    printf("Enter input: ");
    gets(buffer);

    printf("You entered: %s\n", buffer);
    if (hasFlag) {
        printf("Well done! FLAG{REDACTED}\n");
    } else {
        printf("Try again!\n");
    }

    return 0;
}
