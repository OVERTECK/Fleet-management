namespace Backend.DataAccess.DTO.Requests.Driver;

public class CreateDriverRequest
{
    public required string Name { get; init; }

    public required string LastName { get; init; }

    public required string Pathronymic { get; init; }

    public required string ContactData { get; init; }

    public required string CategoryDrive { get; init; }
}