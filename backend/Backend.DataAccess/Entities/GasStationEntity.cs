using System.Text.Json.Serialization;

namespace Backend.DataAccess.Entities;

public class GasStationEntity
{
    public required Guid Id { get; set; }

    public required string CarId { get; set; }

    public required int RefilledLiters { get; set; }

    public required Decimal Price { get; set; }

    public required DateTime Date { get; set; }

    [JsonIgnore]
    public CarEntity Car { get; set; }
}